import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsDate } from 'class-validator';
export class CreateProyectoDto {

    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion!: string;

    @IsInt({ message: 'El idLider debe ser un número.' })
    @Min(1, { message: 'El idLider debe ser mayor 0.' })
    idLider!: number;

    @IsDate()
    @IsNotEmpty({ message: 'Hay un problema con la fecha.' })
    fechaCreacion!: Date;
}

