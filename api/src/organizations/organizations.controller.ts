import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dto/organization.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    description: 'Organization successfully created',
    type: OrganizationDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: OrganizationDto })
  @Post()
  create(@Body() data: OrganizationDto) {
    return this.organizationsService.create(data);
  }

  @ApiOperation({ summary: 'Retrieve all organizations' })
  @ApiResponse({
    description: 'List of organizations retrieved successfully',
    type: [OrganizationDto],
  })
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve an organization by ID' })
  @ApiOkResponse({
    description: 'Organization retrieved successfully',
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @ApiOperation({ summary: 'Update an organization by ID' })
  @ApiOkResponse({
    description: 'Organization updated successfully',
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrganizationDto) {
    return this.organizationsService.update(id, data);
  }

  @ApiOperation({ summary: 'Enable an organization' })
  @ApiOkResponse({
    description: 'Organization enabled successfully',
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Patch(':id/enable')
  enableOrganization(@Param('id') id: string) {
    return this.organizationsService.enableOrganization(id);
  }

  @ApiOperation({ summary: 'Disable an organization' })
  @ApiOkResponse({
    description: 'Organization disabled successfully',
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Patch(':id/disable')
  disableOrganization(@Param('id') id: string) {
    return this.organizationsService.disableOrganization(id);
  }

  @ApiOperation({ summary: 'Toggle organization status (enable/disable)' })
  @ApiOkResponse({
    description: 'Organization status toggled successfully',
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Patch(':id/toggle-status')
  toggleOrganizationStatus(@Param('id') id: string) {
    return this.organizationsService.toggleOrganizationStatus(id);
  }
}
