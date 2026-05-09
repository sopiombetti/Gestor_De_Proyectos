import { PartialType } from '@nestjs/mapped-types';
import { CreateTareaDto } from './create-tarea.dto';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {
    estado?: string | undefined;
    prioridad?: string | undefined;
    idUsuario?: number | undefined;
    estimacion?: number | undefined;
}
