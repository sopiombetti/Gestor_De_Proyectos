import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PrioridadService } from './prioridad.service';
import { Prioridad } from './entities/prioridad.entity';

describe('PrioridadService', () => {
  let service: PrioridadService;
  let repo: { find: jest.Mock; findOne: jest.Mock };

  beforeEach(async () => {
    repo = { find: jest.fn(), findOne: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [PrioridadService, { provide: getRepositoryToken(Prioridad), useValue: repo }],
    }).compile();
    service = module.get(PrioridadService);
  });

  describe('findAll', () => {
    it('devuelve todas las prioridades', async () => {
      const prioridades = [{ id: 1, nombre: 'Baja' }];
      repo.find.mockResolvedValue(prioridades);
      await expect(service.findAll()).resolves.toBe(prioridades);
    });
  });

  describe('findOne', () => {
    it('devuelve la prioridad por id', async () => {
      const prioridad = { id: 3, nombre: 'Alta' };
      repo.findOne.mockResolvedValue(prioridad);
      await expect(service.findOne(3)).resolves.toBe(prioridad);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
    });

    it('lanza NotFoundException si el id no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByName', () => {
    it('devuelve la prioridad por nombre', async () => {
      const prioridad = { id: 2, nombre: 'Media' };
      repo.findOne.mockResolvedValue(prioridad);
      await expect(service.findOneByName('Media')).resolves.toBe(prioridad);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { nombre: 'Media' } });
    });

    it('devuelve null si el nombre no existe (no lanza)', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneByName('Inexistente')).resolves.toBeNull();
    });
  });
});
