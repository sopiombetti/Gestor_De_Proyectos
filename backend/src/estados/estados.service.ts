import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Estado } from './entities/estado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosService {

  constructor(@InjectRepository(Estado)
  private readonly estadoRepo: Repository<Estado>) { }


  findAll() {
    return this.estadoRepo.find();
  }

  findOne(id: number) {
    const estado = this.findOneOrFail(id)
    return estado;
  }

  private async findOneOrFail(id: number): Promise<Estado> {
    const estado = await this.estadoRepo.findOne({ where: { id } });
    if(!estado){
       throw new NotFoundException('Estado no encontrado');
    }
    return estado;
  }

}
