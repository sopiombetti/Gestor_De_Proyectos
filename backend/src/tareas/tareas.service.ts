import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';
import { PrioridadService } from 'src/prioridad/prioridad.service';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { FindTareasQueryDto } from './dto/find-tareas-query.dto';

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
    await this.estadoService.findOne(createTareaDto.idEstado);
    await this.prioridadService.findOne(createTareaDto.idPrioridad);

    if (createTareaDto.idUsuario) {
      await this.usuarioService.findOne(createTareaDto.idUsuario);
    }

    const nuevaTarea = this.tareaRepo.create({
      titulo: createTareaDto.titulo,
      descripcion: createTareaDto.descripcion,
      usuario: createTareaDto.idUsuario ? { id: createTareaDto.idUsuario } : undefined,
      estimacion: createTareaDto.estimacion ?? undefined,
      proyecto: { id: createTareaDto.idProyecto },
      estado: { id: createTareaDto.idEstado },
      prioridad: { id: createTareaDto.idPrioridad }
    })

    return await this.tareaRepo.save(nuevaTarea);
  }

  async findAll(filters: FindTareasQueryDto = {}) {

    if(filters.idUsuario !== undefined) this.usuarioService.findOne(filters.idUsuario) ;
    if(filters.idEstado !== undefined) this.estadoService.findOne(filters.idEstado) ;
    if(filters.idPrioridad !== undefined) this.prioridadService.findOne(filters.idPrioridad);
    if(filters.proyecto !== undefined) this.proyectoService.findOne(filters.proyecto) ;
    
    const where: FindOptionsWhere<Tarea> = {};
    if(filters.idUsuario !== undefined) where.usuario = { id: filters.idUsuario };
    if(filters.idEstado !== undefined) where.estado = { id: filters.idEstado };
    if(filters.idPrioridad !== undefined) where.prioridad = { id: filters.idPrioridad };
    if(filters.proyecto !== undefined) where.proyecto = { id: filters.proyecto };
    
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
    const tareaActualizada = this.tareaRepo.merge(tarea, updateTareaDto);
    return await this.tareaRepo.save(tareaActualizada);
  }

  async remove(id: number) {
    const tarea = await this.findOneOrFail(id);
    await this.tareaRepo.remove(tarea);
    return { message: 'Tarea eliminada correctamente' };
  }

  private async findOneOrFail(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return tarea;
  }
}