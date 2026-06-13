import { UpdateTareaDto } from "src/tareas/dto/update-tarea.dto";
import { Tarea } from "src/tareas/entities/tarea.entity";
import { CambiarEstado } from "./CambiarEstado";
import { ConflictException } from "@nestjs/common";
import { Estado } from "../entities/estado.entity";

export default class EnProgreso implements CambiarEstado {
    modeloEstado!: Estado;

    constructor(estado: Estado) {
        this.modeloEstado = estado;
    }
    validarCambio(updateTareaDto: UpdateTareaDto, tarea: Tarea): Tarea {

        if (updateTareaDto.idUsuario == null && tarea.usuario === null) {
            throw new ConflictException("No se puede cambiar a 'iniciada' una tarea sin un usuario asignado.")
        }
        if (updateTareaDto.estimacion == null && tarea.estimacion == null) {
            throw new ConflictException("No se puede cambiar a 'iniciada' una tarea sin una estimación cargada.")
        }
        tarea.estado = this.modeloEstado;
        return tarea;
    }

}