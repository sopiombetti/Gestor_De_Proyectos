import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import { Tarea } from 'src/tareas/entities/tarea.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('Usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    posicion_laboral!: string;

    @OneToMany(() => Tarea, (tarea) => tarea.usuario)
    tareas!: Tarea[];

    @OneToMany(() => Proyecto, (proyecto) => proyecto.lider)
    proyectos!: Proyecto[];

}