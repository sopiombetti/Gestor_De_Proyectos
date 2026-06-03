import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from 'src/auth/auth.constants';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario)
  private readonly usuarioRepo: Repository<Usuario>) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existente = await this.usuarioRepo.findOne({ where: { email: createUsuarioDto.email } });
    
    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese email.');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      nombre: createUsuarioDto.nombre,
      apellido: createUsuarioDto.apellido,
      email: createUsuarioDto.email,
      password: hashedPassword,
    });
    const saved = await this.usuarioRepo.save(nuevoUsuario);
    return this.findOne(saved.id);
    
  }

  async findAll() {
    return await this.usuarioRepo.find();
  }

  async findOne(id: number) {
    return await this.findOneOrFail(id);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOneOrFail(id);

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existente = await this.usuarioRepo.findOne({
        where: { email: updateUsuarioDto.email },
      });
      if (existente) {
        throw new ConflictException('Ya existe un usuario con ese email.');
      }
      usuario.email = updateUsuarioDto.email;
    }

    if (updateUsuarioDto.nombre !== undefined) usuario.nombre = updateUsuarioDto.nombre;
    if (updateUsuarioDto.apellido !== undefined) usuario.apellido = updateUsuarioDto.apellido;
    if (updateUsuarioDto.password) {
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    await this.usuarioRepo.save(usuario);
    return this.findOne(usuario.id);
  }

  async remove(id: number) {
    await this.findOneOrFail(id);
    await this.usuarioRepo.delete(id);
    return "Usuario eliminado.";
  }

  async login(body: LoginDto) {
    const email = body.email;
    const password = body.password;

    const usuario = await this.usuarioRepo.findOne({
        where: { email },
    });

    function generarToken(usuario: any) {
      return jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol_admin: usuario.rol_admin
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
    }

    if (!usuario) {
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    if (!await bcrypt.compare(password, usuario.password)) {
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    const token = generarToken(usuario);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      isAdmin: usuario.rol_admin,
      token
    };
  }

  private async findOneOrFail(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }
}