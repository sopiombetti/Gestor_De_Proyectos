import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: 'El Nombre es obligatorio.' })
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El Apellido es obligatorio.' })
    apellido!: string;

    @IsEmail()
    @IsNotEmpty({ message: 'El email está vacío o posee un formato incorrecto.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Debe introducir una contraseña.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @Matches(/\d/, { message: 'La contraseña debe incluir al menos un número.' })
    password!: string;
}