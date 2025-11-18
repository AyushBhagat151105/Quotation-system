import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { QuotationExpiryCron } from './quotation-expiry.cron';

@Module({
  providers: [QuotationExpiryCron, PrismaService],
})
export class CronModule {}
