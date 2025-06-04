import {
  Controller,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of plans' })
  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plan details' })
  @ApiParam({ name: 'id', description: 'ID of the plan' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }
}
