import { Tarea } from "src/tareas/entities/tarea.entity";
import { Estado } from "../entities/estado.entity";
import { CambiarEstado } from "./CambiarEstado";
import { UpdateTareaDto } from "src/tareas/dto/update-tarea.dto";
import { ConflictException } from "@nestjs/common";

export default class Asignada implements CambiarEstado {

    modeloEstado!: Estado;

    constructor(estado: Estado) {
        this.modeloEstado = estado;
    }

    validarCambio(updateTareaDto: UpdateTareaDto, tarea: Tarea): Tarea {
        if (updateTareaDto.idUsuario === undefined && (tarea.usuario === null)) {
            throw new ConflictException(
                'No se puede cambiar a estado "Asignada" una tarea sin un usuario asignado.',
            );
        }
        tarea.estado = this.modeloEstado;

        return tarea;
    }
}