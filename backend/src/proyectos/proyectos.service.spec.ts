import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { Proyecto } from './entities/proyecto.entity';
import { Tarea } from 'src/tareas/entities/tarea.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

const admin: Usuario = {
  id: 1, nombre: 'Ana', apellido: 'Admin', email: 'ana@test.com', password: 'h', rol_admin: true,
};
const noAdmin: Usuario = { ...admin, id: 2, email: 'bob@test.com', rol_admin: false };

describe('ProyectosService', () => {
  let service: ProyectosService;
  let proyectoRepo: {
    find: jest.Mock; findOne: jest.Mock; findOneOrFail: jest.Mock;
    create: jest.Mock; save: jest.Mock; remove: jest.Mock;
  };
  let tareaRepo: { count: jest.Mock; delete: jest.Mock };
  let usuarioService: { findOne: jest.Mock };

  beforeEach(async () => {
    proyectoRepo = {
      find: jest.fn(), findOne: jest.fn(), findOneOrFail: jest.fn(),
      create: jest.fn(), save: jest.fn(), remove: jest.fn(),
    };
    tareaRepo = { count: jest.fn(), delete: jest.fn() };
    usuarioService = { findOne: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        ProyectosService,
        { provide: getRepositoryToken(Proyecto), useValue: proyectoRepo },
        { provide: getRepositoryToken(Tarea), useValue: tareaRepo },
        { provide: UsuariosService, useValue: usuarioService },
      ],
    }).compile();
    service = module.get(ProyectosService);
  });

  describe('create', () => {
    const dto = { titulo: 'P', descripcion: 'D', idLider: 1 };

    it('crea el proyecto si el líder es admin', async () => {
      usuarioService.findOne.mockResolvedValue(admin);
      proyectoRepo.create.mockReturnValue({ titulo: 'P' });
      proyectoRepo.save.mockResolvedValue({ id: 5, titulo: 'P' });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 5, titulo: 'P' });
      expect(proyectoRepo.create).toHaveBeenCalledWith(expect.objectContaining({ lider: { id: 1 } }));
    });

    it('lanza ConflictException si el líder no es admin (no debe crear)', async () => {
      usuarioService.findOne.mockResolvedValue(noAdmin);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(proyectoRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devuelve el proyecto existente', async () => {
      const p = { id: 1 };
      proyectoRepo.findOne.mockResolvedValue(p);
      await expect(service.findOne(1)).resolves.toBe(p);
    });

    it('lanza NotFoundException si no existe', async () => {
      proyectoRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('sin filtros devuelve todos cargando el líder', async () => {
      const lista = [{ id: 1 }];
      proyectoRepo.find.mockResolvedValue(lista);
      await expect(service.findAll()).resolves.toBe(lista);
      expect(proyectoRepo.find).toHaveBeenCalledWith({ where: {}, relations: ['lider'] });
    });

    it('valida usuario y proyecto cuando se filtran', async () => {
      usuarioService.findOne.mockResolvedValue(admin);
      proyectoRepo.findOne.mockResolvedValue({ id: 3 });
      proyectoRepo.find.mockResolvedValue([]);

      await service.findAll({ idUsuario: 1, proyecto: 3 });

      expect(usuarioService.findOne).toHaveBeenCalledWith(1);
      expect(proyectoRepo.find).toHaveBeenCalledWith({
        where: { lider: { id: 1 }, id: 3 },
        relations: ['lider'],
      });
    });
  });

  describe('update', () => {
    it('actualiza título y descripción', async () => {
      const p = { id: 1, titulo: 'viejo', descripcion: 'd' } as Proyecto;
      proyectoRepo.findOne.mockResolvedValue(p);
      proyectoRepo.save.mockResolvedValue(p);

      await service.update(1, { titulo: 'nuevo', descripcion: 'nueva' });

      expect(p.titulo).toBe('nuevo');
      expect(p.descripcion).toBe('nueva');
    });

    it('cambia el líder si el nuevo es admin', async () => {
      const p = { id: 1 } as Proyecto;
      proyectoRepo.findOne.mockResolvedValue(p);
      usuarioService.findOne.mockResolvedValue(admin);
      proyectoRepo.save.mockResolvedValue(p);

      await service.update(1, { idLider: 1 });

      expect(p.lider).toEqual({ id: 1 });
    });

    it('lanza ConflictException si el nuevo líder no es admin', async () => {
      proyectoRepo.findOne.mockResolvedValue({ id: 1 });
      usuarioService.findOne.mockResolvedValue(noAdmin);

      await expect(service.update(1, { idLider: 2 })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('elimina cuando no tiene tareas', async () => {
      proyectoRepo.findOne.mockResolvedValue({ id: 1 });
      tareaRepo.count.mockResolvedValue(0);
      await expect(service.remove(1)).resolves.toEqual({ message: 'Se eliminó el proyecto' });
      expect(proyectoRepo.remove).toHaveBeenCalled();
    });

    it('lanza ConflictException si tiene tareas y no se fuerza', async () => {
      proyectoRepo.findOne.mockResolvedValue({ id: 1 });
      tareaRepo.count.mockResolvedValue(3);
      await expect(service.remove(1)).rejects.toThrow(ConflictException);
      expect(proyectoRepo.remove).not.toHaveBeenCalled();
    });

    it('elimina con force aunque tenga tareas', async () => {
      proyectoRepo.findOne.mockResolvedValue({ id: 1 });
      tareaRepo.count.mockResolvedValue(3);
      await expect(service.remove(1, true)).resolves.toEqual({ message: 'Se eliminó el proyecto' });
      expect(proyectoRepo.remove).toHaveBeenCalled();
    });
  });

  describe('getReportData', () => {
    it('arma el reporte mapeando estado por id y los datos del usuario', async () => {
      const proyecto = {
        titulo: 'Proy',
        descripcion: 'Desc',
        tareas: [
          {
            id: 1, titulo: 'T1', descripcion: 'd1',
            estado: { id: 2 },
            usuario: { nombre: 'Juan', apellido: 'P', email: 'j@j.com' },
            fechaAsignacion: new Date('2026-01-01'), estimacion: 5, tiempoFinal: 7,
            fechaCierre: new Date('2026-02-01'),
          },
          {
            id: 2, titulo: 'T2', descripcion: 'd2',
            estado: { id: 1 },
            usuario: null,
            fechaAsignacion: null, estimacion: null, tiempoFinal: null, fechaCierre: null,
          },
          {
            id: 3, titulo: 'T3', descripcion: 'd3',
            estado: { id: 99 }, // estado no mapeado → debe caer al fallback
            usuario: null,
            fechaAsignacion: null, estimacion: null, tiempoFinal: null, fechaCierre: null,
          },
        ],
      };
      proyectoRepo.findOne.mockResolvedValue(proyecto);

      const report = await service.getReportData(1);

      expect(report.name).toBe('Proy');
      expect(report.tasks).toHaveLength(3);
      expect(report.tasks[2].status).toBe('sin_asignar'); // fallback del ?? para estado desconocido
      expect(report.tasks[0].status).toBe('asignada');
      expect(report.tasks[0].assignedUser).toEqual({ name: 'Juan P', email: 'j@j.com' });
      expect(report.tasks[0].actualHours).toBe(7);
      expect(report.tasks[1].status).toBe('sin_asignar');
      expect(report.tasks[1].assignedUser).toBeUndefined();
    });

    it('lanza NotFoundException si el proyecto no existe', async () => {
      proyectoRepo.findOne.mockResolvedValue(null);
      await expect(service.getReportData(99)).rejects.toThrow(NotFoundException);
    });
  });
});
