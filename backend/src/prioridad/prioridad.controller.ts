import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Prioridad')
@ApiBearerAuth()    
@Controller('prioridad')
@UseGuards(JwtAuthGuard)
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las prioridades disponibles' }) 
  findAll() {
    return this.prioridadService.findAll();
  }
}
