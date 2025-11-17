import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAILTRAP_FROM,
        to,
        subject,
        html,
      });

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send email: ' + error.message,
      );
    }
  }

  // -------------------------
  // WELCOME EMAIL
  // -------------------------
  async sendWelcomeEmail(name: string, email: string) {
    const html = `
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Your account has been created successfully.</p>
      <p>We're glad to have you onboard.</p>
    `;

    return this.sendEmail(email, 'Welcome to our platform!', html);
  }

  // -------------------------
  // PASSWORD RESET EMAIL
  // -------------------------
  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetUrl}" style="color: #3366ff;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    return this.sendEmail(email, 'Password Reset Instructions', html);
  }
}
