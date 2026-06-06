import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Tarea } from "src/tareas/entities/tarea.entity";

@Entity ('estados')
export class Estado {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ unique: true })
    nombre!: string; 

    // @OneToMany(() => Tarea, tarea => tarea.estado)
    // tareas: Tarea[];
}
