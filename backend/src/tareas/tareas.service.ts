import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Repository } from 'typeorm';
import { ValidarTarea } from './validarTarea';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';

@Injectable()
export class TareasService {
  constructor(@InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>, private readonly validarTarea: ValidarTarea, private readonly usuarioService: UsuariosService, private readonly estadoService: EstadosService) { }

  async create(createTareaDto: CreateTareaDto) {

    const nuevaTarea = this.tareaRepo.create({... createTareaDto})
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

    const tareas = await this.tareaRepo.find({
      where: { idUsuario },
    });

  return tareas;

  }

  async findByPrioridad(idPrioridad: number) {

    //await this.validarPrioridad.validarIdPrioridad(idPrioridad);
    return await this.tareaRepo.find({
    where: { idPrioridad },
    });

  }

  async findByEstado(idEstado: number) {

    await this.estadoService.findOne(idEstado);

    return await this.tareaRepo.find({
    where: { idEstado },
    });
    
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