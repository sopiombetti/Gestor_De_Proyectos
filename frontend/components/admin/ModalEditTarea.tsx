import { ApiEditarTareaAdmin, ApiGetUsuarios } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useEffect, useState } from "react";
import Select from "../ui/Select";
import { useUsuarios } from "@/hooks/useUsuarios";

type Usuario = {
  id: number
  nombre: string
  apellido: string
  email: string
  rol_admin: boolean
}

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  prioridad:{
    id: number
    nombre: string
  }
  usuario: Usuario
}

interface Props {
    tarea: Tarea;
    onClose: () => void;
    onGuardado: () => void;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModalEditarTarea({ tarea, onClose, onGuardado, setError, setSuccess }: Props) {

    const [titulo, setTitulo] = useState(tarea.titulo);
    const [descripcion, setDescripcion] = useState(tarea.descripcion);
    const [prioridad, setPrioridad] = useState(tarea.prioridad.id);
    const { token } = useUserContext();
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(0);
    const {usuarios} = useUsuarios(token);

    async function editarTarea() {
        try {
            const response = await ApiEditarTareaAdmin(tarea.id, { titulo, descripcion, idPrioridad: prioridad, idUsuario: usuarioSeleccionado }, token);
            if (!response.ok) {
                setError("No se pudo editar la tarea.")
                throw new Error("No se pudo editar la tarea.");
            }
            const data = await response.json();
            console.log(data);
            onClose();
            setSuccess("La tarea se editó correctamente.")
            onGuardado();
            
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                    Editar tarea
                </h2>
                <div className="flex items-center space-x-2">
                    <img className="w-5" src="/check.svg" alt="check" />
                    <h2 className="text-md font-semibold text-gray-800">
                        Título:
                    </h2>
                </div>
                <input
                    className="border border-secondary rounded-md w-full p-2 mb-3 mt-1"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)} />
                <div className="flex items-center space-x-2">
                    <img className="w-5" src="/check.svg" alt="check" />
                    <h2 className="text-md font-semibold text-gray-800">
                        Descripción:
                    </h2>
                </div>
                <textarea
                    className="border w-full p-2 mb-3 border-secondary rounded-md mt-1"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)} />
                <div className="flex items-center space-x-2">
                    <img className="w-5" src="/check.svg" alt="check" />
                    <h2 className="text-md font-semibold text-gray-800">
                        Prioridad:
                    </h2>
                </div>
                <select
                    className="border w-full p-2 mb-3 border-secondary rounded-md mt-1"
                    value={prioridad}
                    onChange={(e) => setPrioridad(Number(e.target.value))}>
                    <option value={1}>Baja</option>
                    <option value={2}>Media</option>
                    <option value={3}>Alta</option>
                </select>
                <Select
                    title="Usuario"
                    options={usuarios.map((u) => ({
                        value: u.id,
                        label: `${u.nombre} ${u.apellido}`,
                    }))}
                    value={usuarioSeleccionado}
                    onChange={(value) => setUsuarioSeleccionado(Number(value))}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="border px-4 py-2 rounded-md cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={editarTarea} className="bg-secondary px-4 py-2 rounded-md cursor-pointer">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}