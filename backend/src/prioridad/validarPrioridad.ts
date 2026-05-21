import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prioridad } from "./entities/prioridad.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ValidarPrioridad{

    constructor(
            @InjectRepository(Prioridad)
            private readonly prioridadRepo: Repository<Prioridad>,
        ) { }

    
    public async validarIdprioridad(id: number) {
        const prioridad = await this.prioridadRepo.findOne({ where: { id } });
        if (!prioridad){
            throw new NotFoundException('Prioridad no encontrada');
        }
        return prioridad;
    }
}