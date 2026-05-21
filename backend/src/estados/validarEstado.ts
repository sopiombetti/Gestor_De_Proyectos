import { Repository } from "typeorm";
import {  Injectable, NotFoundException } from "@nestjs/common";
import { Estado } from "./entities/estado.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ValidarEstado{

    constructor(
                @InjectRepository(Estado)
                private readonly estadoRepo: Repository<Estado>,
            ) { }
    
    public async validarIdEstado(id: number) {
        const estado = await this.estadoRepo.findOne({ where: { id } });
        if (!estado){
            throw new NotFoundException('Estado no encontrado');
        }
        return estado;
    }
}