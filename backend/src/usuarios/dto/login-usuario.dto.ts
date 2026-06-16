import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    
    @IsEmail()
    @IsNotEmpty({ message: 'El email está vacío o posee un formato incorrecto.'})
    email!: string;
     
    @IsString()
    @IsNotEmpty({ message: 'Debe introducir una contraseña.'})
    password!: string;

}
