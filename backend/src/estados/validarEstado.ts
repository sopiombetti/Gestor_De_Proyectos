import { Repository } from "typeorm";
import {  NotFoundException } from "@nestjs/common";
import { Estado } from "./entities/estado.entity";

export class ValidarEstado{

    estadoRepo!: Repository<Estado>;

    constructor(estado: Repository<Estado>) { 
        this.estadoRepo = estado;
    }

    
    public async validarIdEstado(id: number) {
        const estado = await this.estadoRepo.findOne({ where: { id } });
        if (!estado){
            throw new NotFoundException('Estado no encontrado');
        }
        return estado;
    }
}