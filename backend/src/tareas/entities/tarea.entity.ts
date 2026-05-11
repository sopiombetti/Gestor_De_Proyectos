import { Estado } from 'src/estados/entities/estado.entity';
import { Prioridad } from 'src/prioridad/entities/prioridad.entity';
import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tarea {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;
  
  @Column()
  descripcion!: string;
  
  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'idProyecto' })
  proyecto!: Proyecto;
  
  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'idEstado' })
  estado!: Estado;
  
  @ManyToOne(() => Prioridad)
  @JoinColumn({ name: 'idPrioridad' })
  prioridad!: Prioridad;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario!: Usuario;

  @Column()
  estimacion!: number;
}