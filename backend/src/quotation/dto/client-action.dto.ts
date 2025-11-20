import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ClientActionStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ClientActionDto {
  @ApiProperty({
    enum: ClientActionStatus,
    example: ClientActionStatus.APPROVED,
  })
  @IsEnum(ClientActionStatus)
  status: ClientActionStatus;

  @ApiProperty({
    example: 'I would like to negotiate the price.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
