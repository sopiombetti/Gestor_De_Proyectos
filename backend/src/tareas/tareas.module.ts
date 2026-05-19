import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { Tarea } from './entities/tarea.entity';
import { ValidarTarea } from './validarTarea';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ProyectosModule } from 'src/proyectos/proyectos.module';
import { PrioridadModule } from 'src/prioridad/prioridad.module';
import { EstadosModule } from 'src/estados/estados.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea]), 
            UsuariosModule, 
            ProyectosModule, 
            PrioridadModule, 
            EstadosModule],
  controllers: [TareasController],
  providers: [TareasService, ValidarTarea],
})
export class TareasModule {}