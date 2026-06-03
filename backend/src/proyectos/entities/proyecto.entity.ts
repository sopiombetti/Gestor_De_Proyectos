import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Proyecto {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  descripcion!: string;

  @OneToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idLider' })
  lider!: Usuario;

  @CreateDateColumn({ type: 'timestamptz' })
  fechaCreacion!: Date;
}
