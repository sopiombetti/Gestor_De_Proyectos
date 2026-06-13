import { CambiarEstado } from './state/CambiarEstado';
import SinAsignar from './state/SinAsignar';
import { Estado } from './entities/estado.entity';
import EnProgreso from './state/EnProgreso';
import Asignada from './state/Asignada';
import Finalizada from './state/Finalizada';

export const ESTADOS: { codigo: string; nombre: string; clase: new (e: Estado) => CambiarEstado }[] = [
  { codigo: 'SIN_ASIGNAR', nombre: 'Sin asignar', clase: SinAsignar },
  { codigo: 'ASIGNADA',    nombre: 'Asignada',    clase: Asignada },
  { codigo: 'EN_PROGRESO', nombre: 'En progreso', clase: EnProgreso },
  { codigo: 'FINALIZADA',  nombre: 'Finalizada',  clase: Finalizada },
];