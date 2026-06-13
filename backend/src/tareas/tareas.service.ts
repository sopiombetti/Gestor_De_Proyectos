import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';
import { PrioridadService } from 'src/prioridad/prioridad.service';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { FindTareasQueryDto } from './dto/find-tareas-query.dto';
import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import { Estado } from 'src/estados/entities/estado.entity';
import { Prioridad } from 'src/prioridad/entities/prioridad.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class TareasService {
  constructor(@InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>,
    private readonly usuarioService: UsuariosService,
    private readonly estadoService: EstadosService,
    private readonly prioridadService: PrioridadService,
    private readonly proyectoService: ProyectosService) { }

  async create(createTareaDto: CreateTareaDto) {
    let idEstado!: number;
    await this.proyectoService.findOne(createTareaDto.idProyecto);
    await this.prioridadService.findOne(createTareaDto.idPrioridad);

    if (createTareaDto.idUsuario) {
      await this.usuarioService.findOne(createTareaDto.idUsuario);
      idEstado = 2;
    } else { idEstado = 1 }

    const nuevaTarea = this.tareaRepo.create({
      titulo: createTareaDto.titulo,
      descripcion: createTareaDto.descripcion,
      usuario: createTareaDto.idUsuario ? { id: createTareaDto.idUsuario } : undefined,
      estimacion: createTareaDto.estimacion ?? undefined,
      proyecto: { id: createTareaDto.idProyecto },
      estado: { id: idEstado },
      prioridad: { id: createTareaDto.idPrioridad },
      fechaAsignacion: createTareaDto.idUsuario ? new Date() : undefined,
    })

    return await this.tareaRepo.save(nuevaTarea);
  }

  async findAll(filters: FindTareasQueryDto = {}) {

    if (filters.idUsuario !== undefined && filters.idUsuario !== null) await this.usuarioService.findOne(filters.idUsuario);
    if (filters.idEstado !== undefined) await this.estadoService.findOne(filters.idEstado);
    if (filters.idPrioridad !== undefined) await this.prioridadService.findOne(filters.idPrioridad);
    if (filters.proyecto !== undefined) await this.proyectoService.findOne(filters.proyecto);

    const where: FindOptionsWhere<Tarea> = {};
    if (filters.idUsuario === null) {
      where.usuario = IsNull();
    } else if (filters.idUsuario !== undefined) {
      where.usuario = { id: filters.idUsuario };
    }
    if (filters.idEstado !== undefined) where.estado = { id: filters.idEstado };
    if (filters.idPrioridad !== undefined) where.prioridad = { id: filters.idPrioridad };
    if (filters.proyecto !== undefined) where.proyecto = { id: filters.proyecto };

    return await this.tareaRepo.find({
      where,
      relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
    });
  }

  async findOne(id: number) {
    const tarea = await this.findOneOrFail(id);
    return tarea;
  }

  async update(id: number, updateTareaDto: UpdateTareaDto) {
    const tarea = await this.findOneOrFail(id);
    
    if (tarea.estado.id === 4) {
      throw new ConflictException('No se puede editar una tarea finalizada.');
    }

    if (updateTareaDto.idProyecto !== undefined) {
      await this.proyectoService.findOne(updateTareaDto.idProyecto);
      tarea.proyecto = { id: updateTareaDto.idProyecto } as Proyecto;
    }

    if (updateTareaDto.idEstado !== undefined) {
      await this.estadoService.findOne(updateTareaDto.idEstado);
      this.validarEstado(updateTareaDto, tarea);
      if (updateTareaDto.idEstado === 4) {
        tarea.tiempoFinal = updateTareaDto.tiempoFinal;
        tarea.fechaCierre = new Date();
      }
      tarea.estado = { id: updateTareaDto.idEstado } as Estado;
    }

    if (updateTareaDto.idPrioridad !== undefined) {
      await this.prioridadService.findOne(updateTareaDto.idPrioridad);
      tarea.prioridad = { id: updateTareaDto.idPrioridad } as Prioridad;
    }

    if (updateTareaDto.idUsuario !== undefined) {
      await this.usuarioService.findOne(updateTareaDto.idUsuario);
      tarea.usuario = { id: updateTareaDto.idUsuario } as Usuario;
      if (tarea.estado.id <= 2) tarea.estado = { id: 2 } as Estado;
      tarea.fechaAsignacion = new Date();
    }

    if (updateTareaDto.titulo !== undefined) tarea.titulo = updateTareaDto.titulo;
    if (updateTareaDto.descripcion !== undefined) tarea.descripcion = updateTareaDto.descripcion;
    if (updateTareaDto.estimacion !== undefined) tarea.estimacion = updateTareaDto.estimacion;

    return await this.tareaRepo.save(tarea);
  }

  async remove(id: number) {
    const tarea = await this.findOneOrFail(id);
    await this.tareaRepo.remove(tarea);
    return { message: 'Tarea eliminada correctamente' };
  }

  private async findOneOrFail(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepo.findOne({
      where: { id },
      relations: ['estado', 'usuario', 'proyecto', 'prioridad'],
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  private validarEstado(updateTareaDto: UpdateTareaDto, tarea: Tarea) {

    if (updateTareaDto.idEstado === 1) {
      if (tarea.usuario !== null) {
        throw new ConflictException(
          'No se puede cambiar a estado "No asignada" una tarea con un usuario ya asignado.',
        );
      }
    }
    if (updateTareaDto.idEstado === 2) {
      if (tarea.estado.id === 1) {
        if (updateTareaDto.idUsuario === undefined) {
          throw new ConflictException(
            'No se puede cambiar a estado "Asignada" una tarea sin un usuario asignado.',
          );
        }
      }
    }
    if (updateTareaDto.idEstado === 3) {
      if (tarea.estado.id === 1) {
        if (updateTareaDto.idUsuario === undefined) {
          throw new ConflictException(
            'No se puede iniciar una tarea sin un usuario asignado.',
          );
        }
      }
      if (updateTareaDto.estimacion === undefined && tarea.estimacion === undefined) {
        throw new ConflictException(
          'No se puede iniciar una tarea sin estimación calculada.',
        );
      }
    }

    if (updateTareaDto.idEstado === 4) {
      if (tarea.estado.id !== 3) {
        if (updateTareaDto.idUsuario === undefined) {
          throw new ConflictException(
            'No se puede finalizar una tarea que no fue iniciada.',
          );
        }
      }
      if (updateTareaDto.tiempoFinal === undefined) {
        throw new ConflictException(
          'No se puede finalizar una tarea sin la carga del tiempo que demoró en realizarse.',
        );
      }
    }
  }
}