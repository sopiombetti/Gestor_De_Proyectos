import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('prioridad')
@UseGuards(JwtAuthGuard)
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Get()
  findAll() {
    return this.prioridadService.findAll();
  }
}
