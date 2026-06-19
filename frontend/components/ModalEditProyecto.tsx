import { ApiEditarProyectoAdmin } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useState } from "react";

type Proyecto = {
  id: number
  titulo: string
  descripcion: string
  fechaCreacion: string
  lider: {
  id: number
  nombre: string
  apellido: string
  email: string
  rol_admin: boolean
}
}

interface Props {
  proyecto: Proyecto;
  onClose: () => void;
  onGuardado: (proyectoActualizado: Proyecto) => void;
}

export default function ModalEditarProyecto({ proyecto, onClose, onGuardado }: Props) {

  const [titulo, setTitulo] = useState(proyecto.titulo);
  const [descripcion, setDescripcion] = useState(proyecto.descripcion);
  const { token } = useUserContext();

  async function editarProyecto() {
    try {
      const response = await ApiEditarProyectoAdmin(proyecto.id, { titulo, descripcion }, token);
      if (!response.ok) {
        throw new Error("No se pudo editar el proyecto.");
      }
      onGuardado({ ...proyecto, titulo, descripcion });
      onClose();
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">
          Editar proyecto
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
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded-md cursor-pointer">
            Cancelar
          </button>
          <button onClick={editarProyecto} className="bg-secondary px-4 py-2 rounded-md cursor-pointer">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}