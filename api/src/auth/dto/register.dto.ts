import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the account (min. 8 characters)',
    example: 'securePassword123',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Inc',
  })
  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @ApiProperty({
    description: 'Organization identifier (CNPJ, tax ID, etc.)',
    example: '12345678000100',
    required: false,
  })
  @IsOptional()
  @IsString()
  organizationIdentifier?: string;

  @ApiProperty({
    description: 'Organization phone number',
    example: '+55 11 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsString()
  organizationPhone?: string;

  @ApiProperty({
    description: 'Organization email address',
    example: 'contact@acme.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  organizationEmail?: string;
}
