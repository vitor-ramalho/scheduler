import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class ProfessionalDto {
  @ApiProperty({ example: 'Jhon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'email@mail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
