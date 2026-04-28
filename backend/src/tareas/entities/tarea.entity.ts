import { Usuario } from "src/usuarios/entities/usuario.entity";
import { JoinColumn } from "typeorm/browser";

export class Tarea {
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;
}
