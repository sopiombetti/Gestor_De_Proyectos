import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Tarea } from 'src/tareas/entities/tarea.entity';

@Injectable()
export class ProyectosService {
  constructor(@InjectRepository(Proyecto) 
  private readonly proyectoRepo: Repository<Proyecto>, 
  @InjectRepository(Tarea)
  private readonly tareaRepo: Repository<Tarea>,
  private readonly usuarioService: UsuariosService  
  ){}
  
  async create(createProyectoDto: CreateProyectoDto) {

    const lider = await this.usuarioService.findOne(createProyectoDto.idLider); 
    const nuevoProyecto = this.proyectoRepo.create({
      titulo: createProyectoDto.titulo,
      descripcion: createProyectoDto.descripcion,
      lider: { id: lider.id },
      fechaCreacion: createProyectoDto.fechaCreacion
    })
    return this.proyectoRepo.save(nuevoProyecto);
  }

  async findOne(id: number) {
    const proyecto = await this.findOneOrFail(id)
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.findOne(id)
    const proyectoActualizado = this.proyectoRepo.merge(proyecto, updateProyectoDto)
    return this.proyectoRepo.save(proyectoActualizado);
  }

  async remove(id: number, force = false) {
    const proyecto =  await this.findOneOrFail(id);
    const tareasCount = await this.tareaRepo.count({ where: { proyecto: { id } } });

    if (tareasCount > 0 && !force){
      throw new ConflictException(
        `El proyecto tiene ${tareasCount} tarea(s) asociada(s). Requiere confirmación.`,
      )
    }
    await this.proyectoRepo.remove(proyecto)
    return { message: 'Se eliminó el proyecto'};
  }

  private async findOneOrFail(id: number): Promise <Proyecto> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) throw new NotFoundException('No se encontró el proyecto.');
    return proyecto;
  }
}
