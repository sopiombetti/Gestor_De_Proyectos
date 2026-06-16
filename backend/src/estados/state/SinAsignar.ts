import { Tarea } from "src/tareas/entities/tarea.entity";
import { Estado } from "../entities/estado.entity";
import { CambiarEstado } from "./CambiarEstado";
import { UpdateTareaDto } from "src/tareas/dto/update-tarea.dto";
import { ConflictException } from "@nestjs/common";

export default class SinAsignar implements CambiarEstado{
    
    modeloEstado!: Estado;

    constructor(estado: Estado){
        this.modeloEstado = estado;
    }
    
    validarCambio(updateTareaDto: UpdateTareaDto, tarea:Tarea): Tarea {
        if(updateTareaDto.idUsuario != null || tarea.usuario != null){
            throw new ConflictException ("No se puede cambiar al estado 'Sin Asignar' una tarea con un usuario asignado.")
        }
        tarea.estado = this.modeloEstado;
        return tarea;
    }

    
}