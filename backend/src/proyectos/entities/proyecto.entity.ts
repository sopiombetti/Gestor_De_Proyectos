import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class Proyecto {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    titulo!: string;
    
    @Column()
    descripcion!: string;
    
    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'idLider' })
    lider!: Usuario;
    
    @Column()
    fechaCreacion!: Date;
}
