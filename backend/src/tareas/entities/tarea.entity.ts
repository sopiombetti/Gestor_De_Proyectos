import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import { Column, Entity, ForeignKey, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tarea {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;
  
  @Column()
  descripcion!: string;
  
  @Column()
  idPrioridad!: number;
  
  @Column()
  idProyecto!: number;
  
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas)
  @JoinColumn({ name: 'idProyecto' })
  proyecto!: Proyecto;
  
  @Column()
  idEstado!: number;
  
  @Column()
  idUsuario!: number;

  @Column()
  estimacion!: number;
}