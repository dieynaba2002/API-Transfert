import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({ example: 12500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'XOF' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'WAVE' })
  @IsString()
  channel: string;

  @ApiProperty({ example: { phone: '+221770000000', name: 'Jane Doe' } })
  @IsObject()
  recipient: { phone: string; name: string };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
