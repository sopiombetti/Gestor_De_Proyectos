import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prioridad } from './entities/prioridad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrioridadService {

  constructor(@InjectRepository(Prioridad)
  private readonly prioridadRepo: Repository<Prioridad>) { }

  findAll() {
    return this.prioridadRepo.find();
  }

  findOne(id: number) {
    const prioridad = this.findOneOrFail(id);
    return prioridad;
  }

  private async findOneOrFail(id: number): Promise<Prioridad> {
    const prioridad = await this.prioridadRepo.findOne({ where: { id } });
    if (!prioridad) {
      throw new NotFoundException('Prioridad no encontrada');
    }
    return prioridad;
  }
}
