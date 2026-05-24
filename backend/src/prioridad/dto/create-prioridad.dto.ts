import { IsString, IsNotEmpty} from 'class-validator';
export class CreatePrioridadDto {

    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre!: string;

}
