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
}