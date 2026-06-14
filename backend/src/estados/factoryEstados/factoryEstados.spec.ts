import instanciarEstado from './factoryEstados';
import SinAsignar from '../state/SinAsignar';
import Asignada from '../state/Asignada';
import EnProgreso from '../state/EnProgreso';
import Finalizada from '../state/Finalizada';
import { Estado } from '../entities/estado.entity';

const estado = (codigo: string): Estado => ({ id: 1, nombre: codigo, codigo });

describe('instanciarEstado (factory)', () => {
  it('instancia SinAsignar para el código SIN_ASIGNAR', () => {
    expect(instanciarEstado(estado('SIN_ASIGNAR'))).toBeInstanceOf(SinAsignar);
  });

  it('instancia Asignada para el código ASIGNADA', () => {
    expect(instanciarEstado(estado('ASIGNADA'))).toBeInstanceOf(Asignada);
  });

  it('instancia EnProgreso para el código EN_PROGRESO', () => {
    expect(instanciarEstado(estado('EN_PROGRESO'))).toBeInstanceOf(EnProgreso);
  });

  it('instancia Finalizada para el código FINALIZADA', () => {
    expect(instanciarEstado(estado('FINALIZADA'))).toBeInstanceOf(Finalizada);
  });

  it('inyecta el modelo de estado en la instancia creada', () => {
    const modelo = estado('ASIGNADA');
    const instancia = instanciarEstado(modelo) as Asignada;

    expect(instancia.modeloEstado).toBe(modelo);
  });

  it('lanza un error si el código no tiene handler registrado', () => {
    expect(() => instanciarEstado(estado('INEXISTENTE'))).toThrow(
      'No hay handler para el estado "INEXISTENTE".',
    );
  });
});
