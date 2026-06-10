import { UpdateTareaDto } from "src/tareas/dto/update-tarea.dto";
import { Tarea } from "src/tareas/entities/tarea.entity";

export interface CambiarEstado {

    validarCambio(updateTareaDto: UpdateTareaDto, tarea: Tarea): Tarea;
    
}