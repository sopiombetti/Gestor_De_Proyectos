import { Usuario } from "src/usuarios/entities/usuario.entity";
import { JoinColumn, PrimaryGeneratedColumn } from "typeorm";

export class Proyecto {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @JoinColumn({ name: 'lider_id' })
    lider!: Usuario;

    
}
