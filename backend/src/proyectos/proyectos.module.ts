import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { Tarea } from 'src/tareas/entities/tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Tarea]), UsuariosModule],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}

