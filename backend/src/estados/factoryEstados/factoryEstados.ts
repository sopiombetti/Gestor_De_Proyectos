import { Estado } from "../entities/estado.entity";
import { ESTADOS } from "../RegistroEstados";
import { CambiarEstado } from "../state/CambiarEstado";

const registroEstados = new Map(ESTADOS.map(e => [e.codigo, e.clase]));

export default function instanciarEstado(estado: Estado): CambiarEstado {
    const clase = registroEstados.get(estado.codigo);
    if (!clase) throw new Error(`No hay handler para el estado "${estado.codigo}".`);

    const cambiarEstado = new clase(estado);

    return cambiarEstado;
}
