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
import { Prioridad } from 'src/prioridad/entities/prioridad.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CambiarEstado } from 'src/estados/state/CambiarEstado';
import instanciarEstado from 'src/estados/factoryEstados/factoryEstados';

@Injectable()
export class TareasService {
  constructor(@InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>,
    private readonly usuarioService: UsuariosService,
    private readonly estadoService: EstadosService,
    private readonly prioridadService: PrioridadService,
    private readonly proyectoService: ProyectosService) { }

  async create(createTareaDto: CreateTareaDto) {
    await this.proyectoService.findOne(createTareaDto.idProyecto);
    await this.prioridadService.findOne(createTareaDto.idPrioridad);
    if (createTareaDto.idUsuario) {
      await this.usuarioService.findOne(createTareaDto.idUsuario);
    }

    let tarea = this.tareaRepo.create({
      titulo: createTareaDto.titulo,
      descripcion: createTareaDto.descripcion,
      usuario: createTareaDto.idUsuario ? { id: createTareaDto.idUsuario } : undefined,
      estimacion: createTareaDto.estimacion ?? undefined,
      proyecto: { id: createTareaDto.idProyecto },
      prioridad: { id: createTareaDto.idPrioridad },
      fechaAsignacion: createTareaDto.idUsuario ? new Date() : undefined,
    });

    const codigo = createTareaDto.idUsuario ? 'ASIGNADA' : 'SIN_ASIGNAR';
    tarea = await this.aplicarEstado(codigo, tarea, createTareaDto);

    return await this.tareaRepo.save(tarea);
  }

  async findAll(filters: FindTareasQueryDto = {}) {

    if (filters.idUsuario != null) await this.usuarioService.findOne(filters.idUsuario);
    if (filters.idEstado != null) await this.estadoService.findOne(filters.idEstado);
    if (filters.idPrioridad != null) await this.prioridadService.findOne(filters.idPrioridad);
    if (filters.proyecto != null) await this.proyectoService.findOne(filters.proyecto);

    const where: FindOptionsWhere<Tarea> = {};
    if (filters.idUsuario === null) {
      where.usuario = IsNull();
    } else if (filters.idUsuario != null) {
      where.usuario = { id: filters.idUsuario };
    }
    if (filters.idEstado != null) where.estado = { id: filters.idEstado };
    if (filters.idPrioridad != null) where.prioridad = { id: filters.idPrioridad };
    if (filters.proyecto != null) where.proyecto = { id: filters.proyecto };

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
    let tarea = await this.findOneOrFail(id);

    if (tarea.estado.codigo === 'FINALIZADA') {
      throw new ConflictException('No se puede editar una tarea finalizada.');
    }

    if (updateTareaDto.idEstado != null) {
      const estado = await this.estadoService.findOne(updateTareaDto.idEstado);
      const nuevoEstado: CambiarEstado = instanciarEstado(estado);
      nuevoEstado.validarCambio(updateTareaDto, tarea);
    }

    if (updateTareaDto.idPrioridad != null) {
      await this.prioridadService.findOne(updateTareaDto.idPrioridad);
      tarea.prioridad = { id: updateTareaDto.idPrioridad } as Prioridad;
    }

    if (updateTareaDto.idUsuario != null) {
      await this.usuarioService.findOne(updateTareaDto.idUsuario);
      tarea.usuario = { id: updateTareaDto.idUsuario } as Usuario;
      if (tarea.estado.codigo === 'SIN_ASIGNAR') {
        tarea = await this.aplicarEstado('ASIGNADA', tarea, updateTareaDto);
      }

      tarea.fechaAsignacion = new Date();
    }

    if (updateTareaDto.titulo != null) tarea.titulo = updateTareaDto.titulo;
    if (updateTareaDto.descripcion != null) tarea.descripcion = updateTareaDto.descripcion;
    if (updateTareaDto.estimacion != null) tarea.estimacion = updateTareaDto.estimacion;

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
      relations: ['estado', 'usuario'],
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  private async aplicarEstado(codigo: string, tarea: Tarea, dto: UpdateTareaDto): Promise<Tarea> {
    const estado = await this.estadoService.findByCodigo(codigo);
    return instanciarEstado(estado).validarCambio(dto, tarea);
  }
}