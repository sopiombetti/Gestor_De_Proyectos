import { BadRequestException, Injectable } from '@nestjs/common';
import { Estado } from './entities/estado.entity';
import { ValidarEstado } from './validarEstado';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosService {

  constructor(@InjectRepository(Estado)
  private readonly tareaRepo: Repository<Estado>, private readonly validarEstado: ValidarEstado) { }

  
  findAll() {
    return this.tareaRepo.find;
  }

  findOne(id: number) {
    const estado = this.validarEstado.validarIdEstado(id)
    return estado;
  }

}
