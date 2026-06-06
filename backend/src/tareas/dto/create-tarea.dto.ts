import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateTareaDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio'})
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria'})
    descripcion!: string;

    @IsInt({message: 'El idProyecto debe ser un número.'})
    @Min(1, {message: 'El idProyecto debe ser mayor 0.'})
    idProyecto!: number;

    @IsInt({message: 'El idPrioridad debe ser un número.'})
    @Min(1, {message: 'El idPrioridad debe ser mayor 0.'})
    idPrioridad!: number;

    @IsOptional()
    @IsInt({ message: 'El idUsuario debe ser un número' })
    @Min(1, { message: 'El idUsuario debe ser mayor a 0' })
    idUsuario?: number | undefined;

    @IsOptional()
    @IsInt({ message: 'La estimación debe ser un número' })
    @Min(1, { message: 'La estimación debe ser mayor a 0' })
    estimacion?: number | undefined;
}