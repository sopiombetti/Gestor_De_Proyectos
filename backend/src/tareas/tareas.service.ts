import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Repository } from 'typeorm';
import { ValidarTarea } from './validarTarea';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';
import { PrioridadService } from 'src/prioridad/prioridad.service';
import { ProyectosService } from 'src/proyectos/proyectos.service';

@Injectable()
export class TareasService {
  constructor(@InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>, private readonly validarTarea: ValidarTarea, private readonly usuarioService: UsuariosService, private readonly estadoService: EstadosService, private readonly prioridadService: PrioridadService, private readonly proyectoService: ProyectosService) { }

  async create(createTareaDto: CreateTareaDto) {

    await this.proyectoService.findOne(createTareaDto.idProyecto);
    await this.estadoService.findOne(createTareaDto.idEstado);
    await this.prioridadService.findOne(createTareaDto.idPrioridad);

    if(createTareaDto.idUsuario){
      await this.usuarioService.findOne(createTareaDto.idUsuario);
    }

    const nuevaTarea = this.tareaRepo.create({
      titulo: createTareaDto.titulo,
      descripcion: createTareaDto.descripcion,
      usuario: createTareaDto.idUsuario ? { id : createTareaDto.idUsuario } : undefined,
      estimacion: createTareaDto.estimacion ?? undefined, 
      proyecto: { id: createTareaDto.idProyecto }, 
      estado: { id: createTareaDto.idEstado },
      prioridad: { id: createTareaDto.idPrioridad}
    })
    
    return await this.tareaRepo.save(nuevaTarea);   
  }

  async findAll() {
    return await this.tareaRepo.find;
  }

  findOne(id: number) {
    const tarea = this.validarTarea.validarIdTarea(id);
    return tarea;
  }

  async findByUsuario(idUsuario: number) {
    await this.usuarioService.findOne(idUsuario);
    const tareas: Tarea[] = await this.tareaRepo.find({
      where: {  usuario: { id: idUsuario } },
    });
    return tareas;
  }

  async findByPrioridad(idPrioridad: number) {
    await this.prioridadService.findOne(idPrioridad);
    const tareas: Tarea[] = await this.tareaRepo.find({
    where: { prioridad: { id: idPrioridad } },
    }); 
    return tareas;
  }

  async findByEstado(idEstado: number) {
    await this.estadoService.findOne(idEstado);
    const tareas: Tarea[] = await this.tareaRepo.find({
    where: { estado: { id: idEstado } },
    });
    return tareas;
  }

  async update(id: number, updateTareaDto: UpdateTareaDto) {
    const tarea = await this.validarTarea.validarIdTarea(id);
    const tareaActualizada = this.tareaRepo.merge(tarea, updateTareaDto);
    return await this.tareaRepo.save(tareaActualizada);
  }

  async remove(id: number) {
    const tarea = await this.validarTarea.validarIdTarea(id);
    await this.tareaRepo.remove(tarea);
    return { message: 'Tarea eliminada correctamente' };
  }
}