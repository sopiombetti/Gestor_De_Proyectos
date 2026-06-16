import { Test } from '@nestjs/testing';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { FindProyectoQueryDto } from './dto/find-proyecto.dto';

describe('ProyectosController', () => {
  let controller: ProyectosController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [ProyectosController],
      providers: [{ provide: ProyectosService, useValue: service }],
    }).compile();
    controller = module.get(ProyectosController);
  });

  it('create delega en el service', () => {
    const dto: CreateProyectoDto = { titulo: 'P', descripcion: 'D', idLider: 1 };
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll delega pasando los filtros', () => {
    const filters: FindProyectoQueryDto = { idUsuario: 1 };
    controller.findAll(filters);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('findOne convierte el id a número', () => {
    controller.findOne('5');
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('update convierte el id y pasa el dto', () => {
    const dto: UpdateProyectoDto = { titulo: 'Nuevo' };
    controller.update('5', dto);
    expect(service.update).toHaveBeenCalledWith(5, dto);
  });

  it('remove con force="true" elimina forzado', () => {
    controller.remove('5', 'true');
    expect(service.remove).toHaveBeenCalledWith(5, true);
  });

  it('remove sin force no fuerza', () => {
    controller.remove('5');
    expect(service.remove).toHaveBeenCalledWith(5, false);
  });
});
