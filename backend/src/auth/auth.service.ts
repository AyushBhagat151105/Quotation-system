import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/email/email.service';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private email: EmailService,
  ) { }

  // --------------------------
  // REGISTER
  // --------------------------
  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
      });

      await this.email.sendWelcomeEmail(dto.name, dto.email);

      return {
        message: 'User registered successfully',
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch (error) {
      this.logger.error('Error in register', error.stack);
      throw error;
    }
  }

  // --------------------------
  // LOGIN
  // --------------------------
  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const access_token = this.jwt.sign({ sub: user.id, email: user.email });
      const refresh_token = this.jwt.sign(
        { sub: user.id },
        { expiresIn: '7d' },
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refresh_token, lastLogin: new Date() },
      });

      return {
        access_token,
        refresh_token,
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch (error) {
      this.logger.error('Error in login', error.stack);
      throw error;
    }
  }

  // --------------------------
  // REFRESH TOKEN
  // --------------------------
  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) throw new BadRequestException('No token provided');

      const payload = this.jwt.verify(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccess = this.jwt.sign({ sub: user.id, email: user.email });

      return { access_token: newAccess };
    } catch (error) {
      this.logger.error('Error in refresh token', error.stack);
      throw error;
    }
  }

  // --------------------------
  // LOGOUT
  // --------------------------
  async logout(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: null },
      });

      return { message: 'Logged out successfully' };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // --------------------------
  // FORGOT PASSWORD
  // --------------------------
  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) throw new BadRequestException('User does not exist');

      const token = this.jwt.sign({ sub: user.id }, { expiresIn: '15m' });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token },
      });

      await this.email.sendPasswordResetEmail(user.email, token);

      return {
        message: 'Password reset link sent to email',
      };
    } catch (error) {
      this.logger.error('Error in forgot password', error.stack);
      throw error;
    }
  }

  // --------------------------
  // RESET PASSWORD
  // --------------------------
  async resetPassword(token: string, newPassword: string) {
    try {
      let payload;

      try {
        payload = this.jwt.verify(token);
      } catch {
        throw new UnauthorizedException('Token expired or invalid');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.resetToken !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashed,
          resetToken: null,
        },
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      this.logger.error('Error in reset password', error.stack);
      throw error;
    }
  }

  // --------------------------
  // CHANGE PASSWORD
  // --------------------------
  async changePassword(dto: ChangePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw new UnauthorizedException('Invalid user');

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedException('Old password incorrect');

      const hashed = await bcrypt.hash(dto.newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error('Error in change password', error.stack);
      throw error;
    }
  }

  // --------------------------
  // VALIDATE USER (JWT STRATEGY)
  // --------------------------
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
