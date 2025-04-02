import { IsOptional, IsString, IsEmail } from 'class-validator';

export class OrganizationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
