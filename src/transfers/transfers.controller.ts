import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@ApiTags('transfers')
@ApiHeader({ name: 'x-api-key', description: 'API Key' })
@UseGuards(ApiKeyGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private svc: TransfersService) {}

  @ApiOperation({ summary: 'Create transfer' })
  @ApiResponse({ status: 201, description: 'Transfer successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  @ApiOperation({ summary: 'Create transfer' })
  async create(@Body() dto: CreateTransferDto) {
    return this.svc.create(dto);
  }

  @Get()
  async list(@Query() q: any) {
    return this.svc.list(q);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post(':id/process')
  async process(@Param('id') id: string) {
    return this.svc.process(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.svc.cancel(id);
  }
}
