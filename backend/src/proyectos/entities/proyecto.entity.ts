import { Usuario } from "src/usuarios/entities/usuario.entity";
import { JoinColumn } from "typeorm";

export class Proyecto {
    @JoinColumn({ name: 'lider_id' })
    lider!: Usuario;
}
