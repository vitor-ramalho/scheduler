import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';

export class AppointmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: '2024-03-26T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-03-26T11:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
