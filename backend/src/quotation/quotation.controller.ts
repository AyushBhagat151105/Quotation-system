import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Query,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { EmailService } from 'src/email/email.service';

@ApiTags('Quotations')
@Controller('quotations')
export class QuotationController {
  constructor(
    private readonly service: QuotationService,
    private emailService: EmailService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new quotation (admin)' })
  create(@Request() req,@Body() dto: CreateQuotationDto) {
    const adminId = req.user.id;
    return this.service.create(dto, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/:adminId')
  @ApiOperation({ summary: 'List quotations for admin' })
  listForAdmin(
    @Param('adminId') adminId: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.service.listForAdmin(
      adminId,
      take ? Number(take) : 50,
      skip ? Number(skip) : 0,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a quotation by id (admin)' })
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a quotation (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quotation (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/send')
  @ApiOperation({ summary: 'Send quotation link to client email' })
  send(@Param('id') id: string, @Body('email') email: string) {
    return this.emailService.sendQuotationEmail(id, email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/:adminId/stats')
  @ApiOperation({ summary: 'Get dashboard stats for admin' })
  stats(@Param('adminId') adminId: string) {
    return this.service.adminDashboardStats(adminId);
  }

  @Get(':id/public')
  @ApiOperation({ summary: 'Public quotation view (client link)' })
  publicView(@Param('id') id: string) {
    return this.service.publicView(id);
  }
}
