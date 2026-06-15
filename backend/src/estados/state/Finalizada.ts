import { UpdateTareaDto } from "src/tareas/dto/update-tarea.dto";
import { Tarea } from "src/tareas/entities/tarea.entity";
import { CambiarEstado } from "./CambiarEstado";
import { Estado } from "../entities/estado.entity";
import { ConflictException } from "@nestjs/common";

export default class Finalizada implements CambiarEstado {

    modeloEstado!: Estado;

    constructor(estado: Estado) {
        this.modeloEstado = estado;
    }
    validarCambio(updateTareaDto: UpdateTareaDto, tarea: Tarea): Tarea {

        if (updateTareaDto.idUsuario == null && tarea.usuario == null) {
            throw new ConflictException("No se puede cambiar a 'Finalizada' una tarea sin un usuario asignado.")
        }
        if (updateTareaDto.estimacion == null && tarea.estimacion == null) {
            throw new ConflictException("No se puede cambiar a 'Finalizada' una tarea sin una estimación cargada.")
        }
        if (updateTareaDto.tiempoFinal == null && tarea.tiempoFinal == null) {
            throw new ConflictException("No se puede cambiar a 'Finalizada' una tarea sin un tiempo final de duración cargado.")
        }

        tarea.estado = this.modeloEstado;
        tarea.tiempoFinal = updateTareaDto.tiempoFinal;
        tarea.fechaCierre = new Date();

        return tarea;
    }

}