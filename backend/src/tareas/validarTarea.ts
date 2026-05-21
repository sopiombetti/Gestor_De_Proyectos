import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tarea } from "./entities/tarea.entity";

@Injectable()
export class ValidarTarea {
    constructor(
        @InjectRepository(Tarea)
        private readonly tareaRepo: Repository<Tarea>,
    ) { }
    public async validarIdTarea(id: number) {
        const tarea = await this.tareaRepo.findOne({
            where: { id }
        });
        if (!tarea) {
            throw new NotFoundException('Tarea no encontrada');
        }
        return tarea;
    }
}