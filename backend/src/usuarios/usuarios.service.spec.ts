import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { In } from 'typeorm';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { ConfigService } from '@nestjs/config';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const usuarioFixture = (overrides: Partial<Usuario> = {}): Usuario => ({
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@test.com',
  password: 'hash',
  rol_admin: false,
  ...overrides,
});

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repo = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn(), delete: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(Usuario), useValue: repo },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('test') } },
      ],
    }).compile();
    service = module.get(UsuariosService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', password: '1234', rol_admin: true};

    it('crea el usuario hasheando la contraseña y lo devuelve', async () => {
      const guardado = usuarioFixture({ id: 10 });
      repo.findOne.mockResolvedValueOnce(null); // chequeo de email: no existe
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      repo.create.mockReturnValue(usuarioFixture());
      repo.save.mockResolvedValue({ id: 10 });
      repo.findOne.mockResolvedValueOnce(guardado); // findOne(saved.id)

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 12);
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'juan@test.com', password: 'hashed-pass' }),
      );
      expect(result).toBe(guardado);
    });

    it('lanza ConflictException si el email ya existe', async () => {
      repo.findOne.mockResolvedValueOnce(usuarioFixture());
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devuelve todos los usuarios', async () => {
      const usuarios = [usuarioFixture()];
      repo.find.mockResolvedValue(usuarios);
      await expect(service.findAll()).resolves.toBe(usuarios);
    });
  });

  describe('findOne', () => {
    it('devuelve el usuario por id', async () => {
      const u = usuarioFixture();
      repo.findOne.mockResolvedValue(u);
      await expect(service.findOne(1)).resolves.toBe(u);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('lanza NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmails', () => {
    it('devuelve [] si el array está vacío (sin tocar la base)', async () => {
      await expect(service.findByEmails([])).resolves.toEqual([]);
      expect(repo.find).not.toHaveBeenCalled();
    });

    it('busca por los emails con In(...)', async () => {
      const usuarios = [usuarioFixture()];
      repo.find.mockResolvedValue(usuarios);
      await expect(service.findByEmails(['juan@test.com'])).resolves.toBe(usuarios);
      expect(repo.find).toHaveBeenCalledWith({ where: { email: In(['juan@test.com']) } });
    });
  });

  describe('update', () => {
    it('actualiza nombre y re-hashea la password', async () => {
      const actual = usuarioFixture();
      repo.findOne.mockResolvedValueOnce(actual);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      repo.save.mockResolvedValue(actual);
      repo.findOne.mockResolvedValueOnce(actual);

      await service.update(1, { nombre: 'Pedro', apellido: 'Gómez', password: 'nueva' });

      expect(actual.nombre).toBe('Pedro');
      expect(actual.apellido).toBe('Gómez');
      expect(actual.password).toBe('new-hash');
      expect(bcrypt.hash).toHaveBeenCalledWith('nueva', 12);
    });

    it('lanza NotFoundException si el usuario no existe', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('lanza ConflictException si el nuevo email ya está en uso', async () => {
      const actual = usuarioFixture({ email: 'viejo@test.com' });
      repo.findOne.mockResolvedValueOnce(actual); // findOneOrFail
      repo.findOne.mockResolvedValueOnce(usuarioFixture({ id: 2 })); // email en uso
      await expect(service.update(1, { email: 'nuevo@test.com' })).rejects.toThrow(ConflictException);
    });

    it('permite cambiar a un email libre', async () => {
      const actual = usuarioFixture({ email: 'viejo@test.com' });
      repo.findOne.mockResolvedValueOnce(actual); // findOneOrFail
      repo.findOne.mockResolvedValueOnce(null); // email libre
      repo.save.mockResolvedValue(actual);
      repo.findOne.mockResolvedValueOnce(actual); // findOne final

      await service.update(1, { email: 'libre@test.com' });
      expect(actual.email).toBe('libre@test.com');
    });
  });

  describe('remove', () => {
    it('elimina el usuario existente', async () => {
      repo.findOne.mockResolvedValue(usuarioFixture());
      repo.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.toBe('Usuario eliminado.');
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('lanza NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const dto = { email: 'juan@test.com', password: '1234' };

    it('devuelve datos + token con credenciales válidas', async () => {
      const u = usuarioFixture({ id: 7, nombre: 'Juan', rol_admin: true });
      repo.findOne.mockResolvedValue(u);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake.token');

      const result = await service.login(dto);

      expect(result).toEqual({ id: 7, nombre: 'Juan', isAdmin: true, token: 'fake.token' });
      expect(bcrypt.compare).toHaveBeenCalledWith('1234', u.password);
    });

    it('lanza UnauthorizedException si el email no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('lanza UnauthorizedException si la contraseña no coincide', async () => {
      repo.findOne.mockResolvedValue(usuarioFixture());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
