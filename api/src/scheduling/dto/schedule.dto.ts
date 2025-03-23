import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Team Meeting' })
  title: string;

  @ApiProperty({ example: '2023-12-01T10:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2023-12-01T11:00:00.000Z' })
  endTime: Date;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  userId?: string;
}
