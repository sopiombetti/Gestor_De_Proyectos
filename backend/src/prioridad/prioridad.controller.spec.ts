import { Test } from '@nestjs/testing';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('PrioridadController', () => {
  let controller: PrioridadController;
  const service = { findAll: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [PrioridadController],
      providers: [{ provide: PrioridadService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get(PrioridadController);
  });

  it('findAll delega en el service', () => {
    const prioridades = [{ id: 1, nombre: 'Baja' }];
    service.findAll.mockReturnValue(prioridades);
    expect(controller.findAll()).toBe(prioridades);
    expect(service.findAll).toHaveBeenCalled();
  });
});
