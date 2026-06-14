import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsEmail } from 'class-validator';

export class CreateTareaBulkDto {
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio'})
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria'})
    descripcion!: string;

    @IsInt({message: 'El idPrioridad debe ser un número.'})
    @Min(1, {message: 'El idPrioridad debe ser mayor 0.'})
    idPrioridad!: number;
    
    @IsOptional()
    @IsEmail()
    @IsNotEmpty({ message: 'El email está vacío o posee un formato incorrecto.'})
    email?: number | undefined;
}