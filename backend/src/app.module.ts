import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { EstadosModule } from './estados/estados.module';
import { PrioridadModule } from './prioridad/prioridad.module';
import { SeederModule } from './seeder/seeder.module';
import { ReportesModule } from './pdf/pdf.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsuariosModule,
    TareasModule,
    ProyectosModule,
    EstadosModule,
    PrioridadModule,
    SeederModule,
    ReportesModule,
  ],
})
export class AppModule {}