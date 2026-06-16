import { Test } from '@nestjs/testing';
import { EstadosController } from './estados.controller';
import { EstadosService } from './estados.service';

describe('EstadosController', () => {
  let controller: EstadosController;
  const service = { findAll: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [EstadosController],
      providers: [{ provide: EstadosService, useValue: service }],
    }).compile();
    controller = module.get(EstadosController);
  });

  it('findAll delega en el service', () => {
    const estados = [{ id: 1 }];
    service.findAll.mockReturnValue(estados);
    expect(controller.findAll()).toBe(estados);
    expect(service.findAll).toHaveBeenCalled();
  });
});
