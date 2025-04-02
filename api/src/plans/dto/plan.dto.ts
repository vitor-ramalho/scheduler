import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDecimal, IsArray } from 'class-validator';

export class PlanDto {
  @IsString()
  @ApiProperty({ example: 'Basic' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'The basic plan' })
  description?: string;

  @IsDecimal()
  @ApiProperty({ example: '59.9' })
  price: number;

  @IsString()
  @ApiProperty({ example: 'monthly' })
  interval: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}
