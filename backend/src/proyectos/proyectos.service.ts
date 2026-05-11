import { Injectable } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { timeStamp } from 'console';
import { ValidarProyecto } from './validarProyecto';

@Injectable()
export class ProyectosService {
  constructor(@InjectRepository(Proyecto) private readonly proyectoRepo: Repository<Proyecto>, private readonly validarProyecto: ValidarProyecto, private readonly usuarioService: UsuariosService){ }
  
  async create(createProyectoDto: CreateProyectoDto) {

    const lider = await this.usuarioService.findOne(createProyectoDto.idLider); 
    const nuevoProyecto = this.proyectoRepo.create({
      titulo: createProyectoDto.titulo,
      descripcion: createProyectoDto.descripcion,
      lider: { id: lider.id},
      fechaCreacion: createProyectoDto.fechaCreacion
    })
    return this.proyectoRepo.save(nuevoProyecto);
  }

  async findOne(id: number) {
    const proyecto = await this.validarProyecto.validarIdProyecto(id)
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.findOne(id)
    const proyectoActualizado = this.proyectoRepo.merge(proyecto, updateProyectoDto)
    return this.proyectoRepo.save(proyectoActualizado);
  }

  async remove(id: number) {
    const proyecto =  await this.validarProyecto.validarIdProyecto(id)
    await this.proyectoRepo.remove(proyecto)
    return { message: 'Se eliminó el proyecto'};
  }
}
