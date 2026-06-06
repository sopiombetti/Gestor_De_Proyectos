import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Tarea } from 'src/tareas/entities/tarea.entity';
import { FindProyectoQueryDto } from './dto/find-proyecto.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { ProjectReport, TaskReport, ESTADO_MAP } from '../types/report.types';

@Injectable()
export class ProyectosService {
  constructor(@InjectRepository(Proyecto)
  private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
    private readonly usuarioService: UsuariosService
  ) { }

  async create(createProyectoDto: CreateProyectoDto) {

    const lider = await this.usuarioService.findOne(createProyectoDto.idLider);
    const nuevoProyecto = this.proyectoRepo.create({
      titulo: createProyectoDto.titulo,
      descripcion: createProyectoDto.descripcion,
      lider: { id: lider.id },
    })
    return this.proyectoRepo.save(nuevoProyecto);
  }

  async findAll(filters: FindProyectoQueryDto = {}) {

    if (filters.idUsuario !== undefined) this.usuarioService.findOne(filters.idUsuario);
    if (filters.proyecto !== undefined) this.findOneOrFail(filters.proyecto);

    const where: FindOptionsWhere<Proyecto> = {};

    if (filters.idUsuario !== undefined) { where.lider = { id: filters.idUsuario } }

    if (filters.proyecto !== undefined) { where.id = filters.proyecto }

    return await this.proyectoRepo.find({
      where,
      relations: ['lider'],
    });

  }

  async findOne(id: number) {
    const proyecto = await this.findOneOrFail(id)
    return proyecto;
  }

  async update(id: number, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.findOne(id)
    
    if (updateProyectoDto.idLider !== undefined) {
      const lider = await this.usuarioService.findOne(updateProyectoDto.idLider);
      proyecto.lider = { id: lider.id } as Usuario;
    }
    if (updateProyectoDto.titulo !== undefined) proyecto.titulo = updateProyectoDto.titulo;
    if (updateProyectoDto.descripcion !== undefined) proyecto.descripcion = updateProyectoDto.descripcion;

    return this.proyectoRepo.save(proyecto);
  }

  async remove(id: number, force = false) {
    const proyecto = await this.findOneOrFail(id);
    const tareasCount = await this.tareaRepo.count({ where: { proyecto: { id } } });

    if (tareasCount > 0 && !force) {
      throw new ConflictException(
        `El proyecto tiene ${tareasCount} tarea(s) asociada(s). Requiere confirmación.`,
      )
    }
    await this.proyectoRepo.remove(proyecto)
    return { message: 'Se eliminó el proyecto' };
  }

  private async findOneOrFail(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) throw new NotFoundException('No se encontró el proyecto.');
    return proyecto;
  }

  async getReportData(projectId: number): Promise<ProjectReport> {
    const proyecto = await this.proyectoRepo.findOneOrFail({
      where: { id: projectId },
      relations: [
        'tareas',
        'tareas.usuario',
        'tareas.estado',
      ],
    });

    if (!proyecto) {
      throw new NotFoundException(`No se encontró el proyecto.`);
    }

    const tasks: TaskReport[] = proyecto.tareas.map(tarea => ({
      id: tarea.id,
      name: tarea.titulo,
      description: tarea.descripcion,
      status: ESTADO_MAP[tarea.estado.id] ?? 'sin_asignar',

      assignedUser: tarea.usuario
        ? {
            name:  `${tarea.usuario.nombre} ${tarea.usuario.apellido}`,
            email: tarea.usuario.email,
          }
        : undefined,

      assignedAt: tarea.fechaAsignacion ?? undefined,
      estimatedHours: tarea.estimacion  ?? undefined,
      // actualHours: tarea.tiempoReal ?? undefined,
    }));

    return {
      name: proyecto.titulo,
      description: proyecto.descripcion,
      generatedAt: new Date(),
      tasks,
    };
  }
}
