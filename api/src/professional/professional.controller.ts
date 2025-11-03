import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalDto } from './dto/professional.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';

@ApiTags('professionals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationEnabledGuard)
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @ApiOperation({ summary: 'Create a new professional' })
  @ApiResponse({
    status: 201,
    description: 'Professional created successfully',
  })
  @ApiBody({ type: ProfessionalDto })
  @Post()
  create(
    @Body() data: ProfessionalDto,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.professionalService.create(data, organizationId);
  }

  @ApiOperation({ summary: 'Get all professionals for an organization' })
  @ApiResponse({ status: 200, description: 'List of professionals' })
  @Get()
  findAll(@GetUser('organizationId') organizationId: string) {
    return this.professionalService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Update a professional' })
  @ApiResponse({
    status: 200,
    description: 'Professional updated successfully',
  })
  @ApiParam({ name: 'id', description: 'ID of the professional' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<ProfessionalDto>,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.professionalService.update(id, data, organizationId);
  }

  @ApiOperation({ summary: 'Delete a professional' })
  @ApiResponse({
    status: 204,
    description: 'Professional deleted successfully',
  })
  @ApiParam({ name: 'id', description: 'ID of the professional' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.professionalService.remove(id, organizationId);
  }
}
