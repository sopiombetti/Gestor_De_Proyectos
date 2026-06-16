import { Test } from '@nestjs/testing';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';

describe('PrioridadController', () => {
  let controller: PrioridadController;
  const service = { findAll: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [PrioridadController],
      providers: [{ provide: PrioridadService, useValue: service }],
    }).compile();
    controller = module.get(PrioridadController);
  });

  it('findAll delega en el service', () => {
    const prioridades = [{ id: 1, nombre: 'Baja' }];
    service.findAll.mockReturnValue(prioridades);
    expect(controller.findAll()).toBe(prioridades);
    expect(service.findAll).toHaveBeenCalled();
  });
});
