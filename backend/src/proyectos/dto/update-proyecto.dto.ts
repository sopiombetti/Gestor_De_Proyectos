import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoDto } from './create-proyecto.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion?: string;

    @IsOptional()
    @IsInt({ message: 'El idLider debe ser un número.' })
    @Min(1, { message: 'El idLider debe ser mayor 0.' })
    idLider?: number;
}
