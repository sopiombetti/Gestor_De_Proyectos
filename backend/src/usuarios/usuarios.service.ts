import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario)
  private readonly usuarioRepo: Repository<Usuario>) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });
    return await this.usuarioRepo.save(nuevoUsuario);
  }

  async findAll() {
    return await this.usuarioRepo.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });

    if (!usuario) {
      throw new Error(`Usuario con id ${id} no encontado`);
    }
    return usuario;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  async remove(id: number) {

    if (!await this.usuarioRepo.findOne({ where: { id } })) {
      throw new Error(`Usuario con id ${id} no encontado`);
    }

    await this.usuarioRepo.delete(id);

    return "Usuario eliminado.";
  }

  async login(body: LoginDto) {
    const email = body.email;
    const password = body.password;

    const SECRET_KEY = "123456";

    const usuario = await this.usuarioRepo.findOne({
        where: { email },
    });

    function generarToken(usuario: any) {
      return jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
        },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
    }

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    if (!await bcrypt.compare(password, usuario.password)) {
      throw new Error("Constraseña no coincide")
    }

    const token = generarToken(usuario);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      token
    };
  }


}
