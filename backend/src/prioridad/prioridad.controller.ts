import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';

@Controller('prioridad')
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Post()
    create(@Body() createPrioridadDto: CreatePrioridadDto) {
      return this.prioridadService.create(createPrioridadDto);
  }
  @Get()
  findAll() {
    return this.prioridadService.findAll();
  }
}
