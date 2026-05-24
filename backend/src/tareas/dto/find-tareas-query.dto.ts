import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindTareasQueryDto {

    @IsOptional()
    @Type(()=> Number)
    @IsInt({message: 'El idEstado debe ser un número.'})
    @Min(1, {message: 'El idEstado debe ser mayor a 0.'})
    idEstado?: number;
    
    @IsOptional()
    @IsInt({message: 'El idPrioridad debe ser un número.'})
    @Min(1, {message: 'El idPrioridad debe ser mayor a 0.'})
    idPrioridad?: number;
    
    @IsOptional()
    @Type(()=> Number)
    @IsInt({ message: 'El idUsuario debe ser un número' })
    @Min(1, { message: 'El idUsuario debe ser mayor a 0' })
    idUsuario?: number;
    
    @IsOptional()
    @Type(()=> Number)
    @IsInt({ message: 'La idProyecto debe ser un número' })
    @Min(1, { message: 'La idProyecto debe ser mayor a 0' })
    proyecto?: number;
}
