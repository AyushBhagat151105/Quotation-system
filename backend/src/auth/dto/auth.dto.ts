import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'ayush@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
    description: 'Password must be at least 6 characters',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: 'Ayush Bhagat',
    description: 'Full name of the user',
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'ayush@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'ayush@example.com',
    description: 'Email of the user requesting password reset',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT reset token sent to email',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 6,
    description: 'New password (must be at least 6 characters)',
  })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'ayush@example.com',
    description: 'Email of the user changing password',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current password of the user',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 6,
    description: 'New password (must be at least 6 characters)',
  })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
