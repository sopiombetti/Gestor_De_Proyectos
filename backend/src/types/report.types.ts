export enum EstadoId {
  SIN_ASIGNAR = 1,
  ASIGNADA    = 2,
  EN_PROGRESO = 3,
  FINALIZADA  = 4,
}

export type TaskStatus = 'sin_asignar' | 'asignada' | 'en_proceso' | 'finalizada';

export const ESTADO_MAP: Record<number, TaskStatus> = {
  [EstadoId.SIN_ASIGNAR]: 'sin_asignar',
  [EstadoId.ASIGNADA]: 'asignada',
  [EstadoId.EN_PROGRESO]: 'en_proceso',
  [EstadoId.FINALIZADA]: 'finalizada',
};

export interface TaskReport {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  assignedUser?: {
    name: string;
    email: string;
  };
  assignedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: Date;
}

export interface ProjectReport {
  name: string;
  description: string;
  generatedAt: Date;
  tasks: TaskReport[];
}