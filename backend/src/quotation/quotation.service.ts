import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { EmailService } from 'src/email/email.service';
import Decimal from 'decimal.js';
import { ClientActionDto, ClientActionStatus } from './dto/client-action.dto';

@Injectable()
export class QuotationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // -----------------------------------------------------
  // CREATE QUOTATION (adminId always from JWT)
  // -----------------------------------------------------
  async create(dto: CreateQuotationDto, adminId: string) {
    const itemsData = dto.items.map((it) => {
      const qty = new Decimal(it.quantity);
      const unit = new Decimal(it.unitPrice);
      const tax = it.tax ? new Decimal(it.tax) : new Decimal(0);
      const totalPrice = qty.mul(unit).plus(tax);

      return {
        itemName: it.itemName,
        description: it.description ?? '',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        tax: it.tax ?? '0.00',
        totalPrice: totalPrice.toFixed(2),
      };
    });

    const totalAmount = itemsData
      .reduce((acc, it) => acc.plus(new Decimal(it.totalPrice)), new Decimal(0))
      .toFixed(2);

    const quotation = await this.prisma.quotation.create({
      data: {
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        adminId, // <-- FROM JWT ONLY
        status: 'PENDING',
        totalAmount,
        validityDate: dto.validityDate ? new Date(dto.validityDate) : null,
        items: {
          create: itemsData,
        },
      },
      include: { items: true },
    });

    await this.emailService.sendQuotationEmail(
      quotation.id,
      quotation.clientEmail,
    );

    await this.prisma.auditLog.create({
      data: {
        adminId,
        quotationId: quotation.id,
        action: 'CREATE_QUOTATION',
        details: `Created quotation with total ${totalAmount}`,
      },
    });

    return quotation;
  }

  // -----------------------------------------------------
  // GET SINGLE QUOTATION (admin)
  // -----------------------------------------------------
  async findOne(id: string, adminId: string) {
    const q = await this.prisma.quotation.findUnique({
      where: { id },
      include: { items: true, responses: true, emails: true },
    });

    if (!q) throw new NotFoundException('Quotation not found');

    // Ensure owner
    if (q.adminId !== adminId) {
      throw new ForbiddenException('Not your quotation');
    }

    return q;
  }

  // -----------------------------------------------------
  // UPDATE QUOTATION
  // -----------------------------------------------------
  async update(id: string, dto: UpdateQuotationDto, adminId: string) {
    const exists = await this.prisma.quotation.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!exists) throw new NotFoundException('Quotation not found');

    if (exists.adminId !== adminId) {
      throw new ForbiddenException('Not your quotation');
    }

    const allowedUpdates = dto;

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: {
        validityDate: allowedUpdates.validityDate
          ? new Date(allowedUpdates.validityDate)
          : undefined,

        items: allowedUpdates.items
          ? {
              deleteMany: {},
              create: allowedUpdates.items.map((it) => ({
                itemName: it.itemName,
                description: it.description ?? '',
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                tax: it.tax ?? '0.00',
                totalPrice: new Decimal(it.quantity)
                  .mul(it.unitPrice)
                  .plus(it.tax ? new Decimal(it.tax) : 0)
                  .toFixed(2),
              })),
            }
          : undefined,
      },
      include: { items: true },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        quotationId: id,
        action: 'UPDATE_QUOTATION',
        details: `Admin updated quotation details`,
      },
    });

    return updated;
  }

  // -----------------------------------------------------
  // DELETE QUOTATION
  // -----------------------------------------------------
  async remove(id: string, adminId: string) {
    const q = await this.prisma.quotation.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Quotation not found');

    if (q.adminId !== adminId) {
      throw new ForbiddenException('Not your quotation');
    }

    await this.prisma.quotation.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        quotationId: id,
        action: 'DELETE_QUOTATION',
        details: 'Deleted quotation',
      },
    });

    return { message: 'Quotation deleted' };
  }

  // -----------------------------------------------------
  // LIST ALL QUOTATIONS OF LOGGED-IN ADMIN
  // -----------------------------------------------------
  async listForAdmin(adminId: string, take = 50, skip = 0) {
    const [items, count] = await Promise.all([
      this.prisma.quotation.findMany({
        where: { adminId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.quotation.count({ where: { adminId } }),
    ]);

    return { items, count };
  }

  // -----------------------------------------------------
  // PUBLIC QUOTATION VIEW (NO AUTH)
  // -----------------------------------------------------
  async publicView(id: string) {
    const q = await this.prisma.quotation.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!q) throw new NotFoundException('Quotation not found');

    await this.prisma.quotationResponse.create({
      data: {
        quotationId: q.id,
        status: 'PENDING',
        clientIp: null,
        userAgent: null,
      },
    });

    return q;
  }

  // -----------------------------------------------------
  // ADMIN DASHBOARD STATS (jwt)
  // -----------------------------------------------------
  async adminDashboardStats(adminId: string) {
    const total = await this.prisma.quotation.count({ where: { adminId } });
    const pending = await this.prisma.quotation.count({
      where: { adminId, status: 'PENDING' },
    });
    const approved = await this.prisma.quotation.count({
      where: { adminId, status: 'APPROVED' },
    });
    const rejected = await this.prisma.quotation.count({
      where: { adminId, status: 'REJECTED' },
    });

    const recent = await this.prisma.quotation.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return { total, pending, approved, rejected, recent };
  }

  // -----------------------------------------------------
  // SEND QUOTATION EMAIL (admin protected)
  // -----------------------------------------------------
  async sendQuotationEmail(id: string, adminId: string) {
    const q = await this.prisma.quotation.findUnique({ where: { id } });

    if (!q) throw new NotFoundException('Quotation not found');

    if (q.adminId !== adminId) {
      throw new ForbiddenException('Not your quotation');
    }

    return this.emailService.sendQuotationEmail(id, q.clientEmail);
  }

  // -----------------------------------------------------
  // CLIENT RESPONSE (Approve / Reject)
  // -----------------------------------------------------
  async clientRespond(
    quotationId: string,
    dto: ClientActionDto,
    clientIp: string,
    userAgent: string,
  ) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) throw new NotFoundException('Quotation not found');

    if (quotation.status !== 'PENDING') {
      throw new ForbiddenException('Quotation already responded to');
    }

    await this.prisma.quotationResponse.create({
      data: {
        quotationId,
        status: dto.status,
        rejectionComment: dto.comment ?? null,
        clientIp,
        userAgent,
      },
    });

    // Update quotation status
    await this.prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: dto.status,
      },
    });

    await this.emailService
      .sendAdminNotification(
        quotation.adminId,
        quotationId,
        dto.status,
        dto.comment,
      )
      .catch(() => null);

    return {
      message:
        dto.status === ClientActionStatus.APPROVED
          ? 'Quotation approved successfully.'
          : 'Quotation rejected successfully.',
      status: dto.status,
    };
  }
}
