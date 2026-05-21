import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosModule } from './estados/estados.module';
import { PrioridadModule } from './prioridad/prioridad.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'gestor_proyectos',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuariosModule,
    TareasModule,
    ProyectosModule,
    EstadosModule,
    PrioridadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
