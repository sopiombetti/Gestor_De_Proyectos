import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from 'src/estados/entities/estado.entity';
import { Prioridad } from 'src/prioridad/entities/prioridad.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Estado, Prioridad])],
  providers: [SeederService],
})
export class SeederModule {}
