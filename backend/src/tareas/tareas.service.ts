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
import { CambiarEstado } from 'src/estados/state/CambiarEstado';
import instanciarEstado from 'src/estados/factoryEstados/factoryEstados';
import { CreateTareasBulkFileDTO } from './dto/create-tareas-bulkFile.dto';

@Injectable()
export class TareasService {
  constructor(@InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>,
    private readonly usuarioService: UsuariosService,
    private readonly estadoService: EstadosService,
    private readonly prioridadService: PrioridadService,
    private readonly proyectoService: ProyectosService) {
  }

  async create(createTareaDto: CreateTareaDto) {
    if (createTareaDto.idUsuario) await this.validarUsuario(createTareaDto.idUsuario);
    await this.validarProyecto(createTareaDto.idProyecto);
    await this.validarPrioridad(createTareaDto.idPrioridad);

    const tarea = await this.crearTarea(createTareaDto)

    return await this.tareaRepo.save(tarea);
  }

  async createBulk(dto: CreateTareasBulkFileDTO) {
    this.validarProyecto(dto.idProyecto);

    const errores: { fila: number; mensajes: string[] }[] = [];

    throw new Error('Method not implemented.');
  }

  async findOne(id: number) {
    const tarea = await this.findOneOrFail(id);
    return tarea;
  }

  async findAll(filters: FindTareasQueryDto = {}) {

    if (filters.idUsuario != null) await this.validarUsuario(filters.idUsuario);
    if (filters.idEstado != null) await this.validarEstado(filters.idEstado);
    if (filters.idPrioridad != null) await this.validarPrioridad(filters.idPrioridad);
    if (filters.proyecto != null) await this.validarProyecto(filters.proyecto);

    const where = this.whereBuilder(filters);

    return await this.tareaRepo.find({
      where,
      relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
    });
  }

  async update(id: number, updateTareaDto: UpdateTareaDto) {
    const tarea = await this.findOneOrFail(id);

    this.guardFinalizadas(tarea);

    await this.cambiarEstado(updateTareaDto, tarea);
    await this.cambiarPrioridad(updateTareaDto, tarea);
    await this.cambiarUsuario(updateTareaDto, tarea);
    this.cambiarTitulo(updateTareaDto, tarea);
    this.cambiarDescripcion(updateTareaDto, tarea);
    this.cambiarEstimacion(updateTareaDto, tarea);
    this.guardTiempoFinal(updateTareaDto, tarea);

    return await this.tareaRepo.save(tarea);
  }

  async remove(id: number) {
    const tarea = await this.findOneOrFail(id);
    await this.tareaRepo.remove(tarea);
    return { message: 'Tarea eliminada correctamente' };
  }

    private async crearTarea(dto: CreateTareaDto): Promise<Tarea> {
    const tarea = this.tareaRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      usuario: dto.idUsuario ? { id: dto.idUsuario } : undefined,
      estimacion: dto.estimacion ?? undefined,
      proyecto: { id: dto.idProyecto },
      prioridad: { id: dto.idPrioridad },
      fechaAsignacion: dto.idUsuario ? new Date() : undefined,
    });

    await this.aplicarEstadoDefault(tarea, dto);

    return tarea;
  }

  private async findOneOrFail(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepo.findOne({
      where: { id },
      relations: ['proyecto', 'estado', 'prioridad', 'usuario'],
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  private whereBuilder(filters: FindTareasQueryDto): FindOptionsWhere<Tarea> {
    const where: FindOptionsWhere<Tarea> = {}
    if (filters.idUsuario === null) {
      where.usuario = IsNull();
    } else if (filters.idUsuario != null) {
      where.usuario = { id: filters.idUsuario };
    }
    if (filters.idEstado != null) where.estado = { id: filters.idEstado };
    if (filters.idPrioridad != null) where.prioridad = { id: filters.idPrioridad };
    if (filters.proyecto != null) where.proyecto = { id: filters.proyecto };
    return where;
  }

  private cambiarTitulo(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.titulo != null) tarea.titulo = dto.titulo;
  }

  private cambiarDescripcion(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.descripcion != null) tarea.descripcion = dto.descripcion;
  }

  private cambiarEstimacion(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.estimacion != null) tarea.estimacion = dto.estimacion;
  }

  private guardTiempoFinal(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.tiempoFinal != null && tarea.estado.codigo !== 'FINALIZADA') {
      throw new ConflictException({ message: 'No se puede cargar el tiempo final de una tarea sin modificar su estado a "Finalizada".' })
    }
  }

  private async validarProyecto(id: number) {
    return await this.proyectoService.findOne(id);
  }

  private async validarPrioridad(id: number) {
    return await this.prioridadService.findOne(id);
  }

  private async cambiarPrioridad(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.idPrioridad != null) {
      const idPrioridad = dto.idPrioridad;
      const nuevaPrioridad = await this.validarPrioridad(idPrioridad);
      tarea.prioridad = nuevaPrioridad;
    }
  }

  private async validarEstado(id: number) {
    return await this.estadoService.findOne(id);
  }
  
  private async aplicarEstadoDefault(tarea: Tarea, dto: UpdateTareaDto | CreateTareaDto): Promise<void> {
    const codigo = (dto.idUsuario != null || tarea.usuario != null) ? 'ASIGNADA' : 'SIN_ASIGNAR';

    const estado = await this.estadoService.findByCodigo(codigo);
    const estadoDestino = instanciarEstado(estado);
    estadoDestino.validarCambio(dto, tarea);
  }

  private guardFinalizadas(tarea: Tarea) {
    if (tarea.estado.codigo === 'FINALIZADA') {
      throw new ConflictException('No se puede editar una tarea finalizada.');
    }
  }

  private async cambiarEstado(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.idEstado != null) {
      const idEstado = dto.idEstado;
      const estado = await this.validarEstado(idEstado);
      const nuevoEstado: CambiarEstado = instanciarEstado(estado);
      nuevoEstado.validarCambio(dto, tarea);
    }
  }

  private async validarUsuario(idUsuario: number) {
    return await this.usuarioService.findOne(idUsuario);
  }

  private async cambiarUsuario(dto: UpdateTareaDto, tarea: Tarea) {
    if (dto.idUsuario != null) {
      const idUsuario = dto.idUsuario;
      const usuarioNuevo = await this.validarUsuario(idUsuario);
      tarea.usuario = usuarioNuevo;

      if (tarea.estado.codigo === 'SIN_ASIGNAR') {
        await this.aplicarEstadoDefault(tarea, dto);
      }

      tarea.fechaAsignacion = new Date();
    }
  }
}