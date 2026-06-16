import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Estado } from 'src/estados/entities/estado.entity';
import { Prioridad } from 'src/prioridad/entities/prioridad.entity';

const crearQueryBuilderMock = () => {
  const qb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    orIgnore: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };
  return qb;
};

describe('SeederService', () => {
  let service: SeederService;
  let estadoQb: ReturnType<typeof crearQueryBuilderMock>;
  let prioridadQb: ReturnType<typeof crearQueryBuilderMock>;
  let estadoRepo: { createQueryBuilder: jest.Mock };
  let prioridadRepo: { createQueryBuilder: jest.Mock };

  beforeEach(async () => {
    estadoQb = crearQueryBuilderMock();
    prioridadQb = crearQueryBuilderMock();
    estadoRepo = { createQueryBuilder: jest.fn().mockReturnValue(estadoQb) };
    prioridadRepo = { createQueryBuilder: jest.fn().mockReturnValue(prioridadQb) };

    const module = await Test.createTestingModule({
      providers: [
        SeederService,
        { provide: getRepositoryToken(Estado), useValue: estadoRepo },
        { provide: getRepositoryToken(Prioridad), useValue: prioridadRepo },
      ],
    }).compile();
    service = module.get(SeederService);
  });

  it('seedEstados inserta los estados del registro con orIgnore', async () => {
    await service.seedEstados();

    expect(estadoQb.values).toHaveBeenCalledWith(
      expect.arrayContaining([
        { codigo: 'SIN_ASIGNAR', nombre: 'Sin asignar' },
        { codigo: 'FINALIZADA', nombre: 'Finalizada' },
      ]),
    );
    expect(estadoQb.orIgnore).toHaveBeenCalled();
    expect(estadoQb.execute).toHaveBeenCalled();
  });

  it('seedPrioridades inserta Baja, Media y Alta', async () => {
    await service.seedPrioridades();

    expect(prioridadQb.values).toHaveBeenCalledWith([
      { nombre: 'Baja' },
      { nombre: 'Media' },
      { nombre: 'Alta' },
    ]);
    expect(prioridadQb.execute).toHaveBeenCalled();
  });

  it('onApplicationBootstrap siembra estados y prioridades', async () => {
    await service.onApplicationBootstrap();

    expect(estadoRepo.createQueryBuilder).toHaveBeenCalled();
    expect(prioridadRepo.createQueryBuilder).toHaveBeenCalled();
  });
});
