import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  clientName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  clientEmail: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  clientId?: string;
}
