import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanDto } from './dto/plan.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Plan created' })
  @ApiBody({ type: PlanDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() planData: PlanDto) {
    return this.plansService.create(planData);
  }

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

  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plan updated' })
  @ApiParam({ name: 'id', description: 'ID of the plan' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: PlanDto) {
    return this.plansService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Plan deleted' })
  @ApiParam({ name: 'id', description: 'ID of the plan' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.plansService.remove(id);
  }
}
