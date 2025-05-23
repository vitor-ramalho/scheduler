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
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
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
import { ClientDto } from './dto/client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientDto,
  })
  @ApiBody({ type: ClientDto })
  @Post()
  create(
    @Body() clientData: ClientDto,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.clientsService.create(clientData, organizationId);
  }

  @ApiOperation({ summary: 'Get all clients for an organization' })
  @ApiResponse({
    status: 200,
    description: 'List of clients',
  })
  @Get()
  findAll(@GetUser('organizationId') organizationId: string) {
    return this.clientsService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Get a client by identifier' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: ClientDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Get('search')
  findByIdentifier(
    @Query('identifier') identifier: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.clientsService.findByIdentifier(identifier, organizationId);
  }

  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: ClientDto,
  })
  @ApiParam({ name: 'id', description: 'ID of the client' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() clientData: Partial<ClientDto>,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.clientsService.update(id, clientData, organizationId);
  }

  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiParam({ name: 'id', description: 'ID of the client' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.clientsService.remove(id, organizationId);
  }
}
