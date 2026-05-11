import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { Proyecto } from "./entities/proyecto.entity";

export class ValidarProyecto{

    proyectoRepo!: Repository<Proyecto>;

    constructor(proyecto: Repository<Proyecto>) { 
        this.proyectoRepo = proyecto;
    }

    
    public async validarIdProyecto(id: number) {
        const proyecto = await this.proyectoRepo.findOne({ where: { id } });
        if (!proyecto){
            throw new NotFoundException('Proyecto no encontrado.');
        }
        return proyecto;
    }
}
