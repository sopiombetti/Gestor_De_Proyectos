import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ProyectosModule } from './proyectos/proyectos.module';

@Module({
  imports: [UsuariosModule, TareasModule, ProyectosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
