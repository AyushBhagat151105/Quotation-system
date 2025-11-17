import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationDto } from './create-quotation.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {
  @ApiPropertyOptional({ example: 'APPROVED' })
  status?: string;
}
