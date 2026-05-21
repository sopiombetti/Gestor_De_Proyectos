import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Proyecto } from "./entities/proyecto.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ValidarProyecto{

    constructor(
            @InjectRepository(Proyecto)
            private readonly proyectoRepo: Repository<Proyecto>,
        ) { }

    
    public async validarIdProyecto(id: number) {
        const proyecto = await this.proyectoRepo.findOne({ where: { id } });
        if (!proyecto){
            throw new NotFoundException('Proyecto no encontrado.');
        }
        return proyecto;
    }
}
