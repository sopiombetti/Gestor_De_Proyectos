import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { TareasService } from './tareas.service';
import { Tarea } from './entities/tarea.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';
import { PrioridadService } from 'src/prioridad/prioridad.service';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { Estado } from 'src/estados/entities/estado.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

const estSinAsignar: Estado = { id: 1, nombre: 'Sin asignar', codigo: 'SIN_ASIGNAR' };
const estAsignada: Estado = { id: 2, nombre: 'Asignada', codigo: 'ASIGNADA' };
const estEnProgreso: Estado = { id: 3, nombre: 'En progreso', codigo: 'EN_PROGRESO' };
const estFinalizada: Estado = { id: 4, nombre: 'Finalizada', codigo: 'FINALIZADA' };

const usuario: Usuario = {
  id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', password: 'h', rol_admin: false,
};
const prioridad = { id: 1, nombre: 'Baja' };
const proyecto = { id: 1, titulo: 'P' };

const makeTarea = (overrides: Partial<{ [K in keyof Tarea]: Tarea[K] | null }> = {}): Tarea =>
  ({
    id: 1,
    titulo: 'Tarea',
    descripcion: 'Desc',
    estado: estSinAsignar,
    prioridad,
    usuario: null,
    estimacion: null,
    tiempoFinal: null,
    fechaAsignacion: null,
    fechaCierre: null,
    ...overrides,
  } as Tarea);

describe('TareasService', () => {
  let service: TareasService;
  let tareaRepo: { find: jest.Mock; findOne: jest.Mock; create: jest.Mock; save: jest.Mock; remove: jest.Mock };
  let usuarioService: { findOne: jest.Mock; findByEmails: jest.Mock };
  let estadoService: { findOne: jest.Mock; findByCodigo: jest.Mock };
  let prioridadService: { findOne: jest.Mock; findAll: jest.Mock };
  let proyectoService: { findOne: jest.Mock };
  let dataSource: { transaction: jest.Mock };

  beforeEach(async () => {
    tareaRepo = { find: jest.fn(), findOne: jest.fn(), create: jest.fn((o) => o), save: jest.fn(async (t) => t), remove: jest.fn() };
    usuarioService = { findOne: jest.fn(), findByEmails: jest.fn() };
    estadoService = { findOne: jest.fn(), findByCodigo: jest.fn() };
    prioridadService = { findOne: jest.fn(), findAll: jest.fn() };
    proyectoService = { findOne: jest.fn() };
    dataSource = { transaction: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        TareasService,
        { provide: getRepositoryToken(Tarea), useValue: tareaRepo },
        { provide: UsuariosService, useValue: usuarioService },
        { provide: EstadosService, useValue: estadoService },
        { provide: PrioridadService, useValue: prioridadService },
        { provide: ProyectosService, useValue: proyectoService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();
    service = module.get(TareasService);
  });

  describe('create', () => {
    it('crea una tarea asignada cuando viene idUsuario (estado ASIGNADA)', async () => {
      usuarioService.findOne.mockResolvedValue(usuario);
      proyectoService.findOne.mockResolvedValue(proyecto);
      prioridadService.findOne.mockResolvedValue(prioridad);
      estadoService.findByCodigo.mockResolvedValue(estAsignada);

      const dto = { titulo: 'T', descripcion: 'D', idProyecto: 1, idPrioridad: 1, idUsuario: 1 };
      const result = await service.create(dto);

      expect(estadoService.findByCodigo).toHaveBeenCalledWith('ASIGNADA');
      expect(result.estado).toBe(estAsignada);
      expect(result.fechaAsignacion).toBeInstanceOf(Date);
    });

    it('crea una tarea sin asignar cuando no viene idUsuario (estado SIN_ASIGNAR)', async () => {
      proyectoService.findOne.mockResolvedValue(proyecto);
      prioridadService.findOne.mockResolvedValue(prioridad);
      estadoService.findByCodigo.mockResolvedValue(estSinAsignar);

      const dto = { titulo: 'T', descripcion: 'D', idProyecto: 1, idPrioridad: 1 };
      const result = await service.create(dto);

      expect(estadoService.findByCodigo).toHaveBeenCalledWith('SIN_ASIGNAR');
      expect(result.estado).toBe(estSinAsignar);
      expect(usuarioService.findOne).not.toHaveBeenCalled();
    });

    it('propaga el error si el proyecto no existe', async () => {
      proyectoService.findOne.mockRejectedValue(new NotFoundException());
      const dto = { titulo: 'T', descripcion: 'D', idProyecto: 99, idPrioridad: 1 };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('devuelve la tarea con sus relaciones', async () => {
      const tarea = makeTarea();
      tareaRepo.findOne.mockResolvedValue(tarea);
      await expect(service.findOne(1)).resolves.toBe(tarea);
      expect(tareaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['estado', 'usuario', 'proyecto', 'prioridad'],
      });
    });

    it('lanza NotFoundException si no existe', async () => {
      tareaRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('sin filtros arma where vacío', async () => {
      tareaRepo.find.mockResolvedValue([]);
      await service.findAll();
      expect(tareaRepo.find).toHaveBeenCalledWith({
        where: {},
        relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
      });
    });

    it('idUsuario null filtra por tareas sin asignar (IsNull)', async () => {
      tareaRepo.find.mockResolvedValue([]);
      await service.findAll({ idUsuario: null });
      expect(usuarioService.findOne).not.toHaveBeenCalled();
      expect(tareaRepo.find).toHaveBeenCalledWith({
        where: { usuario: IsNull() },
        relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
      });
    });

    it('con filtros válidos los valida y arma el where', async () => {
      usuarioService.findOne.mockResolvedValue(usuario);
      estadoService.findOne.mockResolvedValue(estAsignada);
      prioridadService.findOne.mockResolvedValue(prioridad);
      proyectoService.findOne.mockResolvedValue(proyecto);
      tareaRepo.find.mockResolvedValue([]);

      await service.findAll({ idUsuario: 1, idEstado: 2, idPrioridad: 1, proyecto: 1 });

      expect(usuarioService.findOne).toHaveBeenCalledWith(1);
      expect(tareaRepo.find).toHaveBeenCalledWith({
        where: { usuario: { id: 1 }, estado: { id: 2 }, prioridad: { id: 1 }, proyecto: { id: 1 } },
        relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
      });
    });
  });

  describe('update', () => {
    it('lanza ConflictException al editar una tarea finalizada', async () => {
      tareaRepo.findOne.mockResolvedValue(makeTarea({ estado: estFinalizada }));
      await expect(service.update(1, { titulo: 'x' })).rejects.toThrow('No se puede editar una tarea finalizada.');
    });

    it('cambia título, descripción y estimación', async () => {
      const tarea = makeTarea();
      tareaRepo.findOne.mockResolvedValue(tarea);
      await service.update(1, { titulo: 'Nuevo', descripcion: 'NuevaD', estimacion: 9 });
      expect(tarea.titulo).toBe('Nuevo');
      expect(tarea.descripcion).toBe('NuevaD');
      expect(tarea.estimacion).toBe(9);
    });

    it('transiciona a EN_PROGRESO con usuario y estimación', async () => {
      const tarea = makeTarea({ estado: estAsignada, usuario, estimacion: 5 });
      tareaRepo.findOne.mockResolvedValue(tarea);
      estadoService.findOne.mockResolvedValue(estEnProgreso);
      await service.update(1, { idEstado: 3 });
      expect(estadoService.findOne).toHaveBeenCalledWith(3);
      expect(tarea.estado).toBe(estEnProgreso);
    });

    it('finaliza: setea estado, tiempoFinal y fechaCierre', async () => {
      const tarea = makeTarea({ estado: estEnProgreso, usuario, estimacion: 5 });
      tareaRepo.findOne.mockResolvedValue(tarea);
      estadoService.findOne.mockResolvedValue(estFinalizada);
      await service.update(1, { idEstado: 4, tiempoFinal: 7 });
      expect(tarea.estado).toBe(estFinalizada);
      expect(tarea.tiempoFinal).toBe(7);
      expect(tarea.fechaCierre).toBeInstanceOf(Date);
    });

    it('lanza ConflictException si se carga tiempoFinal sin finalizar', async () => {
      const tarea = makeTarea({ estado: estAsignada, usuario });
      tareaRepo.findOne.mockResolvedValue(tarea);
      await expect(service.update(1, { tiempoFinal: 7 })).rejects.toThrow(ConflictException);
    });

    it('al asignar usuario a una tarea sin asignar, auto-transiciona a ASIGNADA', async () => {
      const tarea = makeTarea({ estado: estSinAsignar, usuario: null });
      tareaRepo.findOne.mockResolvedValue(tarea);
      usuarioService.findOne.mockResolvedValue(usuario);
      estadoService.findByCodigo.mockResolvedValue(estAsignada);

      await service.update(1, { idUsuario: 1 });

      expect(tarea.usuario).toBe(usuario);
      expect(tarea.estado).toBe(estAsignada);
      expect(tarea.fechaAsignacion).toBeInstanceOf(Date);
    });

    it('al reasignar usuario en EN_PROGRESO no cambia el estado', async () => {
      const tarea = makeTarea({ estado: estEnProgreso, usuario, estimacion: 5 });
      tareaRepo.findOne.mockResolvedValue(tarea);
      const otroUsuario: Usuario = { ...usuario, id: 2 };
      usuarioService.findOne.mockResolvedValue(otroUsuario);

      await service.update(1, { idUsuario: 2 });

      expect(tarea.usuario).toBe(otroUsuario);
      expect(tarea.estado).toBe(estEnProgreso);
      expect(estadoService.findByCodigo).not.toHaveBeenCalled();
    });

    it('cambia la prioridad', async () => {
      const tarea = makeTarea();
      const nueva = { id: 2, nombre: 'Media' };
      tareaRepo.findOne.mockResolvedValue(tarea);
      prioridadService.findOne.mockResolvedValue(nueva);
      await service.update(1, { idPrioridad: 2 });
      expect(tarea.prioridad).toBe(nueva);
    });
  });

  describe('remove', () => {
    it('elimina la tarea existente', async () => {
      const tarea = makeTarea();
      tareaRepo.findOne.mockResolvedValue(tarea);
      tareaRepo.remove.mockResolvedValue(tarea);
      await expect(service.remove(1)).resolves.toEqual({ message: 'Tarea eliminada correctamente' });
      expect(tareaRepo.remove).toHaveBeenCalledWith(tarea);
    });
  });

  describe('createBulk', () => {
    const dtoBase = {
      idProyecto: 1,
      tareas: [
        { titulo: 'A', descripcion: 'd', prioridad: 'Alta', email: 'juan@test.com' },
        { titulo: 'B', descripcion: 'd', prioridad: 'Baja' },
      ],
    };

    const prepararFaseUno = () => {
      proyectoService.findOne.mockResolvedValue(proyecto);
      prioridadService.findAll.mockResolvedValue([
        { id: 3, nombre: 'Alta' },
        { id: 1, nombre: 'Baja' },
      ]);
      usuarioService.findByEmails.mockResolvedValue([usuario]); // juan@test.com
      tareaRepo.find.mockResolvedValue([]); // sin títulos existentes
    };

    it('inserta todas las filas válidas en una transacción', async () => {
      prepararFaseUno();
      estadoService.findByCodigo.mockImplementation(async (c: string) =>
        c === 'ASIGNADA' ? estAsignada : estSinAsignar,
      );
      const txRepo = { create: jest.fn((o) => o), save: jest.fn(async (t) => t) };
      const manager = { getRepository: jest.fn().mockReturnValue(txRepo) };
      dataSource.transaction.mockImplementation(async (cb) => cb(manager));

      const result = await service.createBulk(dtoBase);

      expect(result).toEqual({ creadas: 2 });
      expect(txRepo.create).toHaveBeenCalledTimes(2);
      expect(txRepo.save).toHaveBeenCalled();
    });

    it('rechaza con 400 si una prioridad no existe, sin insertar', async () => {
      prepararFaseUno();
      const dto = { idProyecto: 1, tareas: [{ titulo: 'X', descripcion: 'd', prioridad: 'Urgente' }] };

      await expect(service.createBulk(dto)).rejects.toThrow(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('rechaza si un email no resuelve a un usuario', async () => {
      prepararFaseUno();
      const dto = { idProyecto: 1, tareas: [{ titulo: 'X', descripcion: 'd', prioridad: 'Alta', email: 'fantasma@test.com' }] };
      await expect(service.createBulk(dto)).rejects.toThrow(BadRequestException);
    });

    it('rechaza títulos duplicados dentro del archivo', async () => {
      prepararFaseUno();
      const dto = {
        idProyecto: 1,
        tareas: [
          { titulo: 'Rep', descripcion: 'd', prioridad: 'Baja' },
          { titulo: 'Rep', descripcion: 'd', prioridad: 'Baja' },
        ],
      };
      await expect(service.createBulk(dto)).rejects.toThrow(BadRequestException);
    });

    it('rechaza títulos que ya existen en el proyecto', async () => {
      proyectoService.findOne.mockResolvedValue(proyecto);
      prioridadService.findAll.mockResolvedValue([{ id: 1, nombre: 'Baja' }]);
      usuarioService.findByEmails.mockResolvedValue([]);
      tareaRepo.find.mockResolvedValue([{ titulo: 'Existente' }]);

      const dto = { idProyecto: 1, tareas: [{ titulo: 'Existente', descripcion: 'd', prioridad: 'Baja' }] };
      await expect(service.createBulk(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
