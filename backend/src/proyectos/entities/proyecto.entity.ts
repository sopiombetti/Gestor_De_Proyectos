import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tarea } from "src/tareas/entities/tarea.entity";

@Entity()
export class Proyecto {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  descripcion!: string;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idLider' })
  lider!: Usuario;

  @CreateDateColumn({ type: 'timestamptz' })
  fechaCreacion!: Date;

  @OneToMany(() => Tarea, tarea => tarea.proyecto)
  tareas!: Tarea[];
}
