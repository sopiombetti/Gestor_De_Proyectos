import { IsString, IsNotEmpty, IsInt, Min, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { CreateTareaBulkDto } from './create-tarea-bulk.dto';
import { Type } from 'class-transformer';

export class CreateTareasBulkFileDTO {
    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: 'La carga masiva de tareas debe estar asociada a un proyecto.' })
    idProyecto!: number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTareaBulkDto)
    tareas!: CreateTareaBulkDto[];
}