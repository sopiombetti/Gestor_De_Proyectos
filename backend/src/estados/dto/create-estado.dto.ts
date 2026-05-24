import { IsString, IsNotEmpty} from 'class-validator';
export class CreateEstadoDto {

    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre!: string;
    
}
