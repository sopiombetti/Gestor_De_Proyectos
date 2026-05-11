import { Repository } from "typeorm";
import { Tarea } from "./entities/tarea.entity";
import { NotFoundException } from "@nestjs/common";

export class ValidarTarea{

    tareaRepo!: Repository<Tarea>;

    constructor(tarea: Repository<Tarea>) { 
        this.tareaRepo = tarea;
    }

    
    public async validarIdTarea(id: number) {
        const tarea = await this.tareaRepo.findOne({ where: { id } });
        if (!tarea){
            throw new NotFoundException('Tarea no encontrada');
        }
        return tarea;
    }
}