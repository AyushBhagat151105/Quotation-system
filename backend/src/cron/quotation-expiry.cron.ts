import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuotationExpiryCron {
  private readonly logger = new Logger(QuotationExpiryCron.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredQuotations() {
    this.logger.log('Running quotation expiry cron job...');

    try {
      const now = new Date();

      const result = await this.prisma.quotation.updateMany({
        where: {
          status: 'PENDING',
          validityDate: { lt: now },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      this.logger.log(
        `Quotation expiry job completed. Updated ${result.count} quotations.`,
      );
    } catch (error) {
      this.logger.error('Error in quotation expiry cron job', error.stack);
    }
  }
}
