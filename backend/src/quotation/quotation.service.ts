import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { EmailService } from 'src/email/email.service';
import Decimal from 'decimal.js';
import { QuotationStatus } from '@prisma/client';

@Injectable()
export class QuotationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateQuotationDto) {
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
        adminId: dto.adminId,
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

    // create audit log
    await this.prisma.auditLog.create({
      data: {
        adminId: dto.adminId,
        quotationId: quotation.id,
        action: 'CREATE_QUOTATION',
        details: `Created quotation with total ${totalAmount}`,
      },
    });

    return quotation;
  }

  async findOne(id: string) {
    const q = await this.prisma.quotation.findUnique({
      where: { id },
      include: { items: true, responses: true, emails: true },
    });
    if (!q) throw new NotFoundException('Quotation not found');
    return q;
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const exists = await this.prisma.quotation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Quotation not found');

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: {
        status: dto.status ? (dto.status as QuotationStatus) : undefined,
        validityDate: dto.validityDate ? new Date(dto.validityDate) : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId: updated.adminId,
        quotationId: id,
        action: 'UPDATE_QUOTATION',
        details: `Updated fields: ${Object.keys(dto).join(', ')}`,
      },
    });

    return updated;
  }

  async remove(id: string) {
    const q = await this.prisma.quotation.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Quotation not found');

    await this.prisma.quotation.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        adminId: q.adminId,
        quotationId: id,
        action: 'DELETE_QUOTATION',
        details: `Deleted quotation`,
      },
    });

    return { message: 'Quotation deleted' };
  }

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
}
