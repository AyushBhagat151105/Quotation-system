import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { QuotationModule } from './quotation/quotation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    EmailModule,
    QuotationModule,
    CronModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, EmailService],
})
export class AppModule {}
