import { Module } from '@nestjs/common';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [EmailModule],
  controllers: [QuotationController],
  providers: [QuotationService, PrismaService],
})
export class QuotationModule {}
