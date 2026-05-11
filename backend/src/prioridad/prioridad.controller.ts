import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';

@Controller('prioridad')
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Get()
  findAll() {
    return this.prioridadService.findAll();
  }
  
}
