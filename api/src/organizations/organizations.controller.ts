import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dto/organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() data: OrganizationDto) {
    return this.organizationsService.create(data);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<OrganizationDto>) {
    return this.organizationsService.update(id, data);
  }
}
