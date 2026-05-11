import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prioridad } from './entities/prioridad.entity';
import { Repository } from 'typeorm';
import { ValidarPrioridad } from './validarPrioridad';

@Injectable()
export class PrioridadService {

  constructor(@InjectRepository(Prioridad)
  private readonly prioridadRepo: Repository<Prioridad>, private readonly validarPrioridad: ValidarPrioridad) { }
  
  findAll() {
    return this.prioridadRepo.find;
  }

  findOne(id: number) {
    const prioridad = this.validarPrioridad.validarIdprioridad(id);
    return prioridad;
  }
}
