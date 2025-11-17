import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Website design' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ example: 'Landing + 3 pages' , required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '5000.00' })
  @IsString()
  @IsNotEmpty()
  unitPrice: string; // string to map to Decimal

  @ApiProperty({ example: '0.00', required: false })
  @IsOptional()
  @IsString()
  tax?: string;
}
