import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private prisma: PrismaService) {
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

  // ---------------------------------------------------
  // SEND QUOTATION EMAIL (FULL UI/UX TEMPLATE INCLUDED)
  // ---------------------------------------------------
  async sendQuotationEmail(quotationId: string, clientEmail: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true },
    });

    if (!quotation) {
      throw new InternalServerErrorException('Quotation not found');
    }

    const publicLink = `${process.env.APP_URL}/quotations/${quotationId}/public`;

    const html = await this.buildQuotationEmailHtml(quotation, publicLink);

    return this.sendEmail(clientEmail, 'Your Quotation is Ready', html);
  }

  // ---------------------------------------------------
  // QUOTATION EMAIL TEMPLATE (POLISHED UI/UX)
  // ---------------------------------------------------
  private async buildQuotationEmailHtml(q: any, link: string) {
    const itemsHtml = q.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <strong>${item.itemName}</strong><br>
            <small style="color:#555;">${item.description || ''}</small>
          </td>
          <td style="padding: 8px; text-align:center; border-bottom: 1px solid #eee;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; text-align:right; border-bottom: 1px solid #eee;">
            ₹${item.unitPrice}
          </td>
          <td style="padding: 8px; text-align:right; border-bottom: 1px solid #eee;">
            ₹${item.totalPrice}
          </td>
        </tr>`
      )
      .join('');

    return `
    <div style="background:#f5f5f5; padding: 30px; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        
        <h2 style="text-align:center; color:#333; margin-top:0;">Your Quotation is Ready</h2>

        <p style="text-align:center; color:#555; font-size:14px;">
          Quotation ID: <strong>${q.id}</strong>
        </p>

        <hr style="border:none; border-bottom:1px solid #eee; margin:20px 0;">

        <h3 style="color:#444; margin-bottom: 10px;">Quotation Summary</h3>

        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
          <thead>
            <tr>
              <th style="padding:10px; text-align:left; border-bottom:2px solid #ddd;">Item</th>
              <th style="padding:10px; text-align:center; border-bottom:2px solid #ddd;">Qty</th>
              <th style="padding:10px; text-align:right; border-bottom:2px solid #ddd;">Unit Price</th>
              <th style="padding:10px; text-align:right; border-bottom:2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align:right; margin-bottom: 20px;">
          <p style="font-size: 18px; font-weight:bold; color:#222;">
            Grand Total: ₹${q.totalAmount}
          </p>
        </div>

        <div style="text-align:center; margin:30px 0;">
          <a href="${link}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:#007bff;
              color:white;
              text-decoration:none;
              border-radius:6px;
              font-size:16px;
              font-weight:bold;">
            View Full Quotation
          </a>
        </div>

        <p style="color:#777; font-size:13px; text-align:center;">
          If the button doesn't work, copy this link:<br>
          <span style="color:#007bff;">${link}</span>
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

        <p style="font-size:12px; color:#aaa; text-align:center;">
          This is an automated email. Please do not reply.
        </p>

      </div>
    </div>
    `;
  }
}
