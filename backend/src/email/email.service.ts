import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Quotation } from '../generated/prisma/client';
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

  // ─── Shared wrapper ───
  private wrap(body: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <!-- Logo -->
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:22px;font-weight:700;color:#34d399;letter-spacing:-0.5px;">
            Quotation<span style="color:#f1f5f9;">System</span>
          </span>
        </div>

        <!-- Card -->
        <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;overflow:hidden;">
          ${body}
        </div>

        <!-- Footer -->
        <div style="text-align:center;margin-top:32px;">
          <p style="font-size:12px;color:#64748b;margin:0;">
            © ${new Date().getFullYear()} QuotationSystem. All rights reserved.
          </p>
          <p style="font-size:11px;color:#475569;margin:8px 0 0;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>`;
  }

  // ─── WELCOME EMAIL ───
  async sendWelcomeEmail(name: string, email: string) {
    const body = `
      <div style="padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;width:56px;height:56px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:12px;line-height:56px;font-size:28px;">
            🎉
          </div>
        </div>

        <h1 style="margin:0 0 8px;text-align:center;font-size:24px;font-weight:700;color:#f1f5f9;">
          Welcome, ${name}!
        </h1>
        <p style="margin:0 0 24px;text-align:center;font-size:14px;color:#94a3b8;line-height:1.6;">
          Your account has been created successfully.<br>
          You can now start creating and managing quotations.
        </p>

        <div style="text-align:center;">
          <a href="${process.env.APP_URL}/dashboard"
            style="display:inline-block;padding:12px 32px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
            Go to Dashboard →
          </a>
        </div>
      </div>
    `;

    return this.sendEmail(email, 'Welcome to QuotationSystem!', this.wrap(body));
  }

  // ─── PASSWORD RESET EMAIL ───
  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    const body = `
      <div style="padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;width:56px;height:56px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:12px;line-height:56px;font-size:28px;">
            🔑
          </div>
        </div>

        <h1 style="margin:0 0 8px;text-align:center;font-size:24px;font-weight:700;color:#f1f5f9;">
          Password Reset
        </h1>
        <p style="margin:0 0 24px;text-align:center;font-size:14px;color:#94a3b8;line-height:1.6;">
          You requested to reset your password.<br>
          Click the button below to set a new one.
        </p>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="${resetUrl}"
            style="display:inline-block;padding:12px 32px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
            Reset Password
          </a>
        </div>

        <p style="font-size:12px;color:#64748b;text-align:center;line-height:1.5;">
          If the button doesn't work, copy this link:<br>
          <a href="${resetUrl}" style="color:#34d399;word-break:break-all;font-size:11px;">${resetUrl}</a>
        </p>

        <div style="margin-top:20px;padding:12px;background:#0f172a;border-radius:8px;">
          <p style="margin:0;font-size:12px;color:#64748b;text-align:center;">
            If you didn't request this, ignore this email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(email, 'Reset Your Password', this.wrap(body));
  }

  // ─── QUOTATION EMAIL ───
  async sendQuotationEmail(quotationId: string, clientEmail: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true },
    });

    if (!quotation) {
      throw new InternalServerErrorException('Quotation not found');
    }

    const publicLink = `${process.env.APP_URL}/quotation-public/${quotationId}`;
    const html = this.buildQuotationEmailHtml(quotation, publicLink);

    return this.sendEmail(clientEmail, 'Your Quotation is Ready', this.wrap(html));
  }

  private buildQuotationEmailHtml(q: FullQuotation, link: string) {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      APPROVED: { bg: 'rgba(52,211,153,0.15)', text: '#34d399', label: 'APPROVED' },
      REJECTED: { bg: 'rgba(248,113,113,0.15)', text: '#f87171', label: 'REJECTED' },
      EXPIRED: { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', label: 'EXPIRED' },
      PENDING: { bg: 'rgba(250,204,21,0.15)', text: '#facc15', label: 'PENDING' },
      SENT: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', label: 'SENT' },
    };
    const s = statusMap[q.status] || statusMap.PENDING;

    const itemsHtml = q.items
      .map(
        (item) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #334155;">
            <div style="font-size:14px;font-weight:600;color:#f1f5f9;">${item.itemName}</div>
            ${item.description ? `<div style="font-size:12px;color:#64748b;margin-top:2px;">${item.description}</div>` : ''}
          </td>
          <td style="padding:12px 16px;text-align:center;border-bottom:1px solid #334155;color:#cbd5e1;font-size:14px;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px;text-align:right;border-bottom:1px solid #334155;color:#cbd5e1;font-size:14px;">
            ₹${item.unitPrice}
          </td>
          <td style="padding:12px 16px;text-align:right;border-bottom:1px solid #334155;color:#f1f5f9;font-weight:600;font-size:14px;">
            ₹${item.totalPrice}
          </td>
        </tr>`,
      )
      .join('');

    const validDate = q.validityDate
      ? new Date(q.validityDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

    return `
      <!-- Header -->
      <div style="padding:32px 32px 24px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#f1f5f9;">
            Quotation
          </h1>
          <span style="display:inline-block;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;
            background:${s.bg};color:${s.text};letter-spacing:0.5px;">
            ${s.label}
          </span>
        </div>
        <p style="margin:6px 0 0;font-size:12px;color:#64748b;">#${q.id.slice(0, 8)}</p>
      </div>

      <!-- Client Info -->
      <div style="padding:0 32px 20px;">
        <table style="width:100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:12px 16px;background:#0f172a;border-radius:8px 0 0 8px;">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:4px;">Client</div>
              <div style="font-size:14px;color:#f1f5f9;font-weight:600;">${q.clientName}</div>
            </td>
            <td style="padding:12px 16px;background:#0f172a;">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:4px;">Email</div>
              <div style="font-size:14px;color:#f1f5f9;font-weight:600;">${q.clientEmail}</div>
            </td>
            <td style="padding:12px 16px;background:#0f172a;border-radius:0 8px 8px 0;">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:4px;">Valid Until</div>
              <div style="font-size:14px;color:#f1f5f9;font-weight:600;">${validDate}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <div style="padding:0 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#0f172a;">
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Item</th>
              <th style="padding:10px 16px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Qty</th>
              <th style="padding:10px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Unit Price</th>
              <th style="padding:10px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div style="padding:20px 32px;">
        <div style="text-align:right;padding:16px 20px;background:#0f172a;border-radius:8px;">
          <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;display:block;margin-bottom:4px;">Grand Total</span>
          <span style="font-size:28px;font-weight:800;color:#34d399;">₹${q.totalAmount}</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="padding:8px 32px 32px;text-align:center;">
        <a href="${link}"
          style="display:inline-block;padding:14px 40px;background:#059669;color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
          View & Respond to Quotation →
        </a>

        <p style="margin:16px 0 0;font-size:11px;color:#475569;line-height:1.5;">
          Can't click? Copy this link:<br>
          <a href="${link}" style="color:#34d399;word-break:break-all;">${link}</a>
        </p>
      </div>
    `;
  }

  // ─── ADMIN NOTIFICATION ───
  async sendAdminNotification(
    adminId: string,
    quotationId: string,
    status: string,
    comment?: string,
  ) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin) return;

    const isApproved = status === 'APPROVED';
    const emoji = isApproved ? '✅' : '❌';
    const statusColor = isApproved ? '#34d399' : '#f87171';
    const statusBg = isApproved ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)';

    const body = `
      <div style="padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;width:56px;height:56px;background:${statusBg};border-radius:12px;line-height:56px;font-size:28px;">
            ${emoji}
          </div>
        </div>

        <h1 style="margin:0 0 8px;text-align:center;font-size:22px;font-weight:700;color:#f1f5f9;">
          Quotation ${status}
        </h1>
        <p style="margin:0 0 20px;text-align:center;font-size:14px;color:#94a3b8;">
          Your quotation <span style="color:#f1f5f9;font-weight:600;">#${quotationId.slice(0, 8)}</span>
          was <span style="color:${statusColor};font-weight:700;">${status}</span> by the client.
        </p>

        ${comment
        ? `
          <div style="padding:16px;background:#0f172a;border-radius:8px;border-left:3px solid ${statusColor};margin-bottom:20px;">
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Client Comment</p>
            <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.5;">"${comment}"</p>
          </div>`
        : ''
      }

        <div style="text-align:center;">
          <a href="${process.env.APP_URL}/dashboard/quotations/${quotationId}"
            style="display:inline-block;padding:12px 32px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
            View Quotation →
          </a>
        </div>
      </div>
    `;

    return this.sendEmail(
      admin.email,
      `Quotation ${status} — #${quotationId.slice(0, 8)}`,
      this.wrap(body),
    );
  }
}
