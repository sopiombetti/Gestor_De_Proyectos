import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity ('prioridad')
export class Prioridad {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    nombre!: string;
}
