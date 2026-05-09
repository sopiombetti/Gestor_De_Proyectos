import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./entities/usuario.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";

export class ValidarUsuario{

    usuarioRepo!: Repository<Usuario>;

    constructor(usuario: Repository<Usuario>) { 
        this.usuarioRepo = usuario;
    }

    
    public async validarIdUsuario(id: number) {
        const usuario = await this.usuarioRepo.findOne({ where: { id } });
        if (!usuario){
            throw new NotFoundException('Usuario no encontrado');
        }
        return usuario;
    }

    public async validarDto(dto: CreateUsuarioDto) {
        if(dto.apellido === null){
            if(dto.nombre === null){
                    
                throw new BadRequestException('Los campos "Nombre" y "Apellido" son obligatorios.');
            }
            
            throw new BadRequestException('El campo "Nombre" es obligatorio.');

        }else if(dto.apellido === null){
            
            throw new BadRequestException('El campo "Apellido" es obligatorio.');

        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {

            throw new BadRequestException('Email inválido');

        }
    }
    
}