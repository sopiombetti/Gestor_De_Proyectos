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

    public async validarDto(dto: CreateTareaDto) {
        if(dto.titulo === null){
            if(dto.descripcion === null){
                    
                throw new BadRequestException('Los campos "Título" y "Descripción" son obligatorios.');
            }
            
            throw new BadRequestException('El campo "Título" es obligatorio.');

        }else if(dto.descripcion === null){
            
            throw new BadRequestException('El campo "Descripción" es obligatorio.');

        }else if(dto.idPrioridad === null || dto.idPrioridad < 0){
            
            throw new BadRequestException('Debe seleccionar una prioridad');

        }else if(dto.idProyecto < 0 || dto.idProyecto === null || dto.idEstado < 0 || dto.idEstado === null){
            
            throw new BadRequestException('Los datos son inconsistentes. Por favor, intente nuevamente.');

        }
    }
}