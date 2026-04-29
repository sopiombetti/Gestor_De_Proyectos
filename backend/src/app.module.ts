import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gestor_proyectos',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuariosModule,
    TareasModule,
    ProyectosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
