import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import jwt, { type SignOptions } from 'jsonwebtoken';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario)
  private readonly usuarioRepo: Repository<Usuario>, private readonly config: ConfigService,) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existente = await this.usuarioRepo.findOne({ where: { email: createUsuarioDto.email } });

    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese email.');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 12);

    const nuevoUsuario = this.usuarioRepo.create({
      nombre: createUsuarioDto.nombre,
      apellido: createUsuarioDto.apellido,
      email: createUsuarioDto.email,
      password: hashedPassword,
      rol_admin: createUsuarioDto.rol_admin
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

  async findByEmails(emails: string[]): Promise<Usuario[]> {
    if (emails.length === 0) return [];
    return this.usuarioRepo.find({ where: { email: In(emails) } });
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
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, 12);
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

    const generarToken = (usuario: any) => {
      return jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol_admin: usuario.rol_admin
        },
        this.config.get<string>('JWT_SECRET')!,
        { 
          expiresIn: this.config.get<string>('JWT_EXPIRES_IN') as SignOptions['expiresIn'] 
        },
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