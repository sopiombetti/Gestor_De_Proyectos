import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrioridadService } from './prioridad.service';
import { PrioridadController } from './prioridad.controller';
import { Prioridad } from './entities/prioridad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prioridad])],
  controllers: [PrioridadController],
  providers: [PrioridadService],
  exports: [PrioridadService],
})
export class PrioridadModule {}
