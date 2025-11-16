import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
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
