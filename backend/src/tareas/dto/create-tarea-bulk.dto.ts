import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateTareaBulkDto {
  @IsString() @IsNotEmpty()
  titulo!: string;

  @IsString() @IsNotEmpty()
  descripcion!: string;

  @IsString() @IsNotEmpty()
  prioridad!: string;

  @IsOptional() @IsEmail()
  email?: string;
}