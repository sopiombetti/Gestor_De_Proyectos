import { Module } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { PrioridadController } from './prioridad.controller';

@Module({
  controllers: [PrioridadController],
  providers: [PrioridadService],
})
export class PrioridadModule {}
