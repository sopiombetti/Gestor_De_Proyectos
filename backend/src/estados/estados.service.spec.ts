import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { Estado } from './entities/estado.entity';

describe('EstadosService', () => {
  let service: EstadosService;
  let repo: { find: jest.Mock; findOne: jest.Mock };

  beforeEach(async () => {
    repo = { find: jest.fn(), findOne: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [EstadosService, { provide: getRepositoryToken(Estado), useValue: repo }],
    }).compile();
    service = module.get(EstadosService);
  });

  describe('findAll', () => {
    it('devuelve todos los estados', async () => {
      const estados = [{ id: 1, nombre: 'Sin asignar', codigo: 'SIN_ASIGNAR' }];
      repo.find.mockResolvedValue(estados);
      await expect(service.findAll()).resolves.toBe(estados);
    });
  });

  describe('findOne', () => {
    it('devuelve el estado buscado por id', async () => {
      const estado = { id: 2, nombre: 'Asignada', codigo: 'ASIGNADA' };
      repo.findOne.mockResolvedValue(estado);
      await expect(service.findOne(2)).resolves.toBe(estado);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });

    it('lanza NotFoundException si el id no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCodigo', () => {
    it('devuelve el estado buscado por código', async () => {
      const estado = { id: 3, nombre: 'En progreso', codigo: 'EN_PROGRESO' };
      repo.findOne.mockResolvedValue(estado);
      await expect(service.findByCodigo('EN_PROGRESO')).resolves.toBe(estado);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { codigo: 'EN_PROGRESO' } });
    });

    it('lanza NotFoundException si el código no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findByCodigo('XXX')).rejects.toThrow(NotFoundException);
    });
  });
});
