import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUsuarioDto {
    
    @IsString()
    @IsNotEmpty({ message: 'El Nombre es obligatorio.'})
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El Apellido es obligatorio.'})
    apellido!: string;

    @IsEmail()
    @IsNotEmpty({ message: 'El email está vacío o posee un formato incorrecto.'})
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Debe introducir una contraseña.'})
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'La posición laboral es obligatorio.'})
    posicion_laboral!: string;
}