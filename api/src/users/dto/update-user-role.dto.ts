import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'superadmin', description: 'New role for the user' })
  role: 'admin' | 'user' | 'superadmin';
}
