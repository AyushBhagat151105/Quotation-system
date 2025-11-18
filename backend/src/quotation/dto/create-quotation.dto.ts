import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class CreateQuotationDto {
  @ApiProperty({ example: 'Rohit Sharma' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({ example: 'rohit@gmail.com' })
  @IsEmail()
  clientEmail: string;


  @ApiProperty({ example: '2025-12-31T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  validityDate?: string;

  @ApiProperty({ type: [CreateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}
