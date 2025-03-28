import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class ClientDto {
  @ApiProperty({ example: '12526555452' })
  @Matches(/^\d{11}$/, { message: 'Identifier must be exactly 11 digits' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
