import { Test } from '@nestjs/testing';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { FindTareasQueryDto } from './dto/find-tareas-query.dto';
import { CreateTareasBulkFileDTO } from './dto/create-tareas-bulkFile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('TareasController', () => {
  let controller: TareasController;
  const service = {
    create: jest.fn(),
    createBulk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [{ provide: TareasService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(TareasController);
  });

  it('create delega en el service', () => {
    const dto: CreateTareaDto = { titulo: 'T', descripcion: 'D', idProyecto: 1, idPrioridad: 1 };
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('createBulk delega en el service', () => {
    const dto: CreateTareasBulkFileDTO = { idProyecto: 1, tareas: [] };
    controller.createBulk(dto);
    expect(service.createBulk).toHaveBeenCalledWith(dto);
  });

  it('findAll delega pasando los filtros', () => {
    const filters: FindTareasQueryDto = { idPrioridad: 2 };
    controller.findAll(filters);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  it('findOne convierte el id a número', () => {
    controller.findOne('7');
    expect(service.findOne).toHaveBeenCalledWith(7);
  });

  it('update convierte el id y pasa el dto', () => {
    const dto: UpdateTareaDto = { titulo: 'X' };
    controller.update('7', dto);
    expect(service.update).toHaveBeenCalledWith(7, dto);
  });

  it('remove convierte el id a número', () => {
    controller.remove('7');
    expect(service.remove).toHaveBeenCalledWith(7);
  });
});
