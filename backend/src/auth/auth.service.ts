import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private email: EmailService,
  ) {}

  // --------------------------
  // REGISTER
  // --------------------------
  async register(dto: RegisterDto) {
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
  }

  // --------------------------
  // LOGIN
  // --------------------------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const access_token = this.jwt.sign({ sub: user.id, email: user.email });
    const refresh_token = this.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh_token },
    });

    return {
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  // --------------------------
  // REFRESH TOKEN
  // --------------------------
  async refreshToken(refreshToken: string) {
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
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new BadRequestException('User does not exist');

    const token = this.jwt.sign({ sub: user.id }, { expiresIn: '15m' });

    // save token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token },
    });

    await this.email.sendPasswordResetEmail(user.email, token);

    return {
      message: 'Password reset link sent to email',
      resetToken: token, // remove in production
    };
  }

  // --------------------------
  // RESET PASSWORD
  // --------------------------
  async resetPassword(token: string, newPassword: string) {
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
  }

  // --------------------------
  // CHANGE PASSWORD
  // --------------------------
  async changePassword(dto: ChangePasswordDto) {
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
  }

  // --------------------------
  // VALIDATE USER (JWT STRATEGY)
  // --------------------------
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
