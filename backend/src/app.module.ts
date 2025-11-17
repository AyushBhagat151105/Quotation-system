import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { QuotationModule } from './quotation/quotation.module';

@Module({
  imports: [AuthModule, EmailModule, QuotationModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, EmailService],
})
export class AppModule {}
