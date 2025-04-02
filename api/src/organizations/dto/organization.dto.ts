import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class OrganizationDto {
  @IsString()
  @ApiProperty({ example: 'Acme Inc' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '57425448000101' })
  identifier?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '54822514520' })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'acme@inc.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  planId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive?: boolean;
}
