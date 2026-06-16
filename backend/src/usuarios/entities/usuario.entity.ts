import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Tarea } from 'src/tareas/entities/tarea.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column()
    rol_admin: boolean = false;

    // @OneToMany(() => Tarea, tarea => tarea.usuario)
    // tareas: Tarea[];
}