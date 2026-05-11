import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { Prioridad } from "./entities/prioridad.entity";

export class ValidarPrioridad{

    prioridadRepo!: Repository<Prioridad>;

    constructor(prioridad: Repository<Prioridad>) { 
        this.prioridadRepo = prioridad;
    }

    
    public async validarIdprioridad(id: number) {
        const prioridad = await this.prioridadRepo.findOne({ where: { id } });
        if (!prioridad){
            throw new NotFoundException('Prioridad no encontrada');
        }
        return prioridad;
    }
}