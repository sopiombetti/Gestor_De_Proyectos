import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindProyectoQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El idUsuario debe ser un entero positivo o "null"' })
    @Min(1, { message: 'El idUsuario debe ser mayor a 0 o "null"' })
    idUsuario?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'La idProyecto debe ser un número' })
    @Min(1, { message: 'La idProyecto debe ser mayor a 0' })
    proyecto?: number;
}
