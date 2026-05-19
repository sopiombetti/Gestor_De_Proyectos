import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { ValidarProyecto } from './validarProyecto';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto]), UsuariosModule],
  controllers: [ProyectosController],
  providers: [ProyectosService, ValidarProyecto, UsuariosModule],
  exports: [ProyectosService],
})
export class ProyectosModule {}
