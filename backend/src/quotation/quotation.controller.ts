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
import { ClientActionDto } from './dto/client-action.dto';

@ApiTags('Quotations')
@Controller('quotations')
export class QuotationController {
  constructor(private readonly service: QuotationService) {}

  // -----------------------------
  // CREATE QUOTATION
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new quotation (admin)' })
  create(@Request() req, @Body() dto: CreateQuotationDto) {
    return this.service.create(dto, req.user.id);
  }

  // -----------------------------
  // LIST ADMIN QUOTATIONS
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin')
  @ApiOperation({ summary: 'List quotations for logged-in admin' })
  listForAdmin(
    @Request() req,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.service.listForAdmin(
      req.user.id,
      take ? Number(take) : 50,
      skip ? Number(skip) : 0,
    );
  }

  // -----------------------------
  // GET SINGLE QUOTATION
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a quotation by id (admin)' })
  getOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(id, req.user.id);
  }

  // -----------------------------
  // UPDATE QUOTATION
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a quotation (admin)' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateQuotationDto,
  ) {
    return this.service.update(id, dto, req.user.id);
  }

  // -----------------------------
  // DELETE QUOTATION
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quotation (admin)' })
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(id, req.user.id);
  }

  // -----------------------------
  // SEND QUOTATION EMAIL
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/send')
  @ApiOperation({ summary: 'Send quotation link to client email' })
  send(@Request() req, @Param('id') id: string) {
    return this.service.sendQuotationEmail(id, req.user.id);
  }

  // -----------------------------
  // ADMIN DASHBOARD STATS
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/stats')
  @ApiOperation({ summary: 'Get dashboard stats for admin' })
  stats(@Request() req) {
    return this.service.adminDashboardStats(req.user.id);
  }

  // -----------------------------
  // PUBLIC VIEW (NO AUTH)
  // -----------------------------
  @Get(':id/public')
  @ApiOperation({ summary: 'Public quotation view (client link)' })
  publicView(@Param('id') id: string) {
    return this.service.publicView(id);
  }

  // -----------------------------
  // CLIENT ACTION (Approve/Reject)
  // -----------------------------
  @Post(':id/respond')
  @ApiOperation({ summary: 'Client approve/reject quotation' })
  clientRespond(
    @Param('id') id: string,
    @Body() dto: ClientActionDto,
    @Request() req,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const agent = req.headers['user-agent'];
    return this.service.clientRespond(id, dto, ip, agent);
  }
}
