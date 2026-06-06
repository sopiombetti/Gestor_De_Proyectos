import { PartialType } from '@nestjs/mapped-types';
import { CreateTareaDto } from './create-tarea.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {

    @IsOptional()
    @IsInt({message: 'El idEstado debe ser un número.'})
    @Min(1, {message: 'El idEstado debe ser mayor a 0.'})
    idEstado?: number | undefined;
    
    @IsOptional()
    @IsInt({message: 'El idPrioridad debe ser un número.'})
    @Min(1, {message: 'El idPrioridad debe ser mayor a 0.'})
    idPrioridad?: number | undefined;
    
    @IsOptional()
    @IsInt({ message: 'El idUsuario debe ser un número' })
    @Min(1, { message: 'El idUsuario debe ser mayor a 0' })
    idUsuario?: number | undefined;
    
    @IsOptional()
    @IsInt({ message: 'La estimación debe ser un número' })
    @Min(1, { message: 'La estimación debe ser mayor a 0' })
    estimacion?: number | undefined;
    
    @IsOptional()
    @IsInt({ message: 'La estimación debe ser un número' })
    @Min(1, { message: 'La estimación debe ser mayor a 0' })
    tiempoFinal?: number | undefined;
}
