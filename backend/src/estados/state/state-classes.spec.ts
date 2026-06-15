import { ConflictException } from '@nestjs/common';
import SinAsignar from './SinAsignar';
import Asignada from './Asignada';
import EnProgreso from './EnProgreso';
import Finalizada from './Finalizada';
import { Estado } from '../entities/estado.entity';
import { Tarea } from 'src/tareas/entities/tarea.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UpdateTareaDto } from 'src/tareas/dto/update-tarea.dto';

const estado = (codigo: string, id: number, nombre: string): Estado => ({ id, nombre, codigo });

const usuario: Usuario = {
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@test.com',
  password: 'hash',
  rol_admin: false,
};

const makeTarea = (overrides: Partial<{ [K in keyof Tarea]: Tarea[K] | null }> = {}): Tarea =>
  ({
    id: 1,
    titulo: 'Tarea',
    descripcion: 'Desc',
    usuario: null,
    estimacion: null,
    tiempoFinal: null,
    fechaAsignacion: null,
    fechaCierre: null,
    ...overrides,
  } as Tarea);

describe('SinAsignar', () => {
  const modelo = estado('SIN_ASIGNAR', 1, 'Sin asignar');

  it('asigna el estado cuando la tarea no tiene usuario (ni en dto ni en entidad)', () => {
    const tarea = makeTarea({ usuario: null });
    const resultado = new SinAsignar(modelo).validarCambio({}, tarea);

    expect(resultado.estado).toBe(modelo);
  });

  it('lanza ConflictException si la tarea ya tiene usuario asignado', () => {
    const tarea = makeTarea({ usuario });

    expect(() => new SinAsignar(modelo).validarCambio({}, tarea)).toThrow(ConflictException);
  });

  it('lanza ConflictException si el dto trae un usuario', () => {
    const tarea = makeTarea({ usuario: null });
    const dto: UpdateTareaDto = { idUsuario: 5 };

    expect(() => new SinAsignar(modelo).validarCambio(dto, tarea)).toThrow(ConflictException);
  });
});

describe('Asignada', () => {
  const modelo = estado('ASIGNADA', 2, 'Asignada');

  it('asigna el estado cuando el dto trae un usuario', () => {
    const tarea = makeTarea({ usuario: null });
    const resultado = new Asignada(modelo).validarCambio({ idUsuario: 5 }, tarea);

    expect(resultado.estado).toBe(modelo);
  });

  it('asigna el estado cuando la tarea ya tiene usuario (sin idUsuario en el dto)', () => {
    const tarea = makeTarea({ usuario });
    const resultado = new Asignada(modelo).validarCambio({}, tarea);

    expect(resultado.estado).toBe(modelo);
  });

  it('lanza ConflictException si no hay usuario ni en el dto ni en la entidad', () => {
    const tarea = makeTarea({ usuario: null });

    expect(() => new Asignada(modelo).validarCambio({}, tarea)).toThrow(ConflictException);
  });
});

describe('EnProgreso', () => {
  const modelo = estado('EN_PROGRESO', 3, 'En progreso');

  it('asigna el estado con usuario y estimación presentes', () => {
    const tarea = makeTarea({ usuario, estimacion: 5 });
    const resultado = new EnProgreso(modelo).validarCambio({}, tarea);

    expect(resultado.estado).toBe(modelo);
  });

  it('toma la estimación desde el dto si la entidad no la tiene', () => {
    const tarea = makeTarea({ usuario, estimacion: null });
    const resultado = new EnProgreso(modelo).validarCambio({ estimacion: 8 }, tarea);

    expect(resultado.estado).toBe(modelo);
  });

  it('lanza ConflictException sin usuario', () => {
    const tarea = makeTarea({ usuario: null, estimacion: 5 });

    expect(() => new EnProgreso(modelo).validarCambio({}, tarea)).toThrow(
      'No se puede cambiar a \'iniciada\' una tarea sin un usuario asignado.',
    );
  });

  it('lanza ConflictException sin estimación (ni en dto ni en entidad)', () => {
    const tarea = makeTarea({ usuario, estimacion: null });

    expect(() => new EnProgreso(modelo).validarCambio({}, tarea)).toThrow(
      'No se puede cambiar a \'iniciada\' una tarea sin una estimación cargada.',
    );
  });
});

describe('Finalizada', () => {
  const modelo = estado('FINALIZADA', 4, 'Finalizada');

  it('asigna estado, tiempoFinal y fechaCierre cuando está todo cargado', () => {
    const tarea = makeTarea({ usuario, estimacion: 5, tiempoFinal: null });
    const resultado = new Finalizada(modelo).validarCambio({ tiempoFinal: 7 }, tarea);

    expect(resultado.estado).toBe(modelo);
    expect(resultado.tiempoFinal).toBe(7);
    expect(resultado.fechaCierre).toBeInstanceOf(Date);
  });

  it('lanza ConflictException sin usuario', () => {
    const tarea = makeTarea({ usuario: null, estimacion: 5, tiempoFinal: 7 });

    expect(() => new Finalizada(modelo).validarCambio({ tiempoFinal: 7 }, tarea)).toThrow(
      'No se puede cambiar a \'Finalizada\' una tarea sin un usuario asignado.',
    );
  });

  it('lanza ConflictException sin estimación', () => {
    const tarea = makeTarea({ usuario, estimacion: null, tiempoFinal: 7 });

    expect(() => new Finalizada(modelo).validarCambio({ tiempoFinal: 7 }, tarea)).toThrow(
      'No se puede cambiar a \'Finalizada\' una tarea sin una estimación cargada.',
    );
  });

  it('lanza ConflictException sin tiempo final (ni en dto ni en entidad)', () => {
    const tarea = makeTarea({ usuario, estimacion: 5, tiempoFinal: null });

    expect(() => new Finalizada(modelo).validarCambio({}, tarea)).toThrow(
      'No se puede cambiar a \'Finalizada\' una tarea sin un tiempo final de duración cargado.',
    );
  });
});
