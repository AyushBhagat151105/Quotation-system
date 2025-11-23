import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Quotation } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma.service';
import { FullQuotation } from 'src/types/Quotation';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

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

    const publicLink = `${process.env.APP_URL}/quotation-public/${quotationId}`;

    const html = await this.buildQuotationEmailHtml(quotation, publicLink);

    return this.sendEmail(clientEmail, 'Your Quotation is Ready', html);
  }

  // ---------------------------------------------------
  // QUOTATION EMAIL TEMPLATE (POLISHED UI/UX)
  // ---------------------------------------------------
  private async buildQuotationEmailHtml(q: FullQuotation, link: string) {
    const statusColor =
      q.status === 'APPROVED'
        ? '#28a745'
        : q.status === 'REJECTED'
          ? '#dc3545'
          : q.status === 'EXPIRED'
            ? '#6c757d'
            : '#f0ad4e';

    const itemsHtml = q.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong style="font-size: 14px;">${item.itemName}</strong><br>
          <small style="color:#777;">${item.description || ''}</small>
        </td>
        <td style="padding: 10px; text-align:center; border-bottom: 1px solid #eee;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; text-align:right; border-bottom: 1px solid #eee;">
          ₹${item.unitPrice}
        </td>
        <td style="padding: 10px; text-align:right; border-bottom: 1px solid #eee;">
          ₹${item.totalPrice}
        </td>
      </tr>`,
      )
      .join('');

    return `
  <div style="background:#f2f4f6; padding: 40px; font-family: Arial, sans-serif;">
    <div style="max-width:650px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 6px 25px rgba(0,0,0,0.08);">
      
      <h2 style="text-align:center; color:#333; font-size:24px; margin-top:0;">
        Your Quotation is Ready
      </h2>

      <div style="text-align:center; margin-bottom: 15px;">
        <span style="
          background:${statusColor};
          padding:6px 14px;
          border-radius:20px;
          color:white;
          font-size:13px;
          font-weight:bold;
          text-transform:uppercase;">
          ${q.status}
        </span>
      </div>

      <p style="text-align:center; color:#555; margin-top:10px; font-size:14px;">
        <strong>Quotation ID:</strong> ${q.id}
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">

      <h3 style="color:#444; margin-bottom: 12px; font-size:18px;">
        Quotation Summary
      </h3>

      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:12px; text-align:left; border-bottom:2px solid #ddd;">Item</th>
            <th style="padding:12px; text-align:center; border-bottom:2px solid #ddd;">Qty</th>
            <th style="padding:12px; text-align:right; border-bottom:2px solid #ddd;">Unit Price</th>
            <th style="padding:12px; text-align:right; border-bottom:2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="
        text-align:right;
        margin-top:20px;
        margin-bottom: 25px;
        background:#f8f9fa;
        padding: 12px 18px;
        border-radius:8px;
      ">
        <span style="font-size:18px; font-weight:bold; color:#222;">
          Grand Total: ₹${q.totalAmount}
        </span>
      </div>

      <div style="text-align:center; margin:40px 0 20px;">
        <a href="${link}"
          style="
            display:inline-block;
            padding:14px 28px;
            background:#0056d2;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-size:16px;
            font-weight:bold;
            box-shadow:0 4px 12px rgba(0,0,0,0.15);
          ">
          View Full Quotation
        </a>
      </div>

      <p style="color:#777; font-size:13px; text-align:center; line-height:1.6;">
        If the button doesn’t work, use this link:<br>
        <a href="${link}" style="color:#0056d2; word-break:break-all;">${link}</a>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

      <p style="font-size:12px; color:#aaa; text-align:center;">
        This is an automated email. Please do not reply.
      </p>

    </div>
  </div>`;
  }

  async sendAdminNotification(
    adminId: string,
    quotationId: string,
    status: string,
    comment?: string,
  ) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin) return;

    const html = `
    <h2>Quotation Response</h2>
    <p>Your quotation (ID: ${quotationId}) was <strong>${status}</strong> by the client.</p>
    ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
  `;

    return this.sendEmail(admin.email, 'Quotation Response Received', html);
  }
}
