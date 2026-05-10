import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tarea } from "./entities/tarea.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateTareaDto } from "./dto/create-tarea.dto";

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