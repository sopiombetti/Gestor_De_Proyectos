import { Test } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login-usuario.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: service }],
    }).compile();
    controller = module.get(UsuariosController);
  });

  it('create delega en el service', () => {
    const dto: CreateUsuarioDto = { nombre: 'A', apellido: 'B', email: 'a@b.com', password: '1234' };
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll delega en el service', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne convierte el id a número', () => {
    controller.findOne('3');
    expect(service.findOne).toHaveBeenCalledWith(3);
  });

  it('update convierte el id y pasa el dto', () => {
    const dto: UpdateUsuarioDto = { nombre: 'Nuevo' };
    controller.update('3', dto);
    expect(service.update).toHaveBeenCalledWith(3, dto);
  });

  it('remove convierte el id a número', () => {
    controller.remove('3');
    expect(service.remove).toHaveBeenCalledWith(3);
  });

  it('login delega en el service', () => {
    const dto: LoginDto = { email: 'a@b.com', password: '1234' };
    controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
