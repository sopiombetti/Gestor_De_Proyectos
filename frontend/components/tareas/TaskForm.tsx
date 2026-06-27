import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ApiCrearTarea } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useUsuarios } from "@/hooks/useUsuarios";

interface Props {
  idProyecto: number;
  onClose: () => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export default function TaskForm({ idProyecto, onClose, setError, setSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState(0);
  const [usuario, setUsuario] = useState(0);
  const { token } = useUserContext();
  const { usuarios } = useUsuarios(token);

  async function PostTarea() {
    try {
      const response = await ApiCrearTarea({ idProyecto, titulo, descripcion, idPrioridad: prioridad, idUsuario: usuario }, token);
      if (!response.ok) {
        setError("No se pudo crear la tarea.");
        throw new Error("No se pudo crear la tarea.");
      }
      onClose();
      setSuccess("La tarea se creó exitosamente.")
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h1 className="text-2xl font-bold mb-4">
          Crear tarea
        </h1>

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

        <Select
          title="Prioridad"
          options={[
            { value: "", label: "Seleccione prioridad" },
            { value: 1, label: "Baja" },
            { value: 2, label: "Media" },
            { value: 3, label: "Alta" },
          ]}
          value={prioridad}
          onChange={(value) => setPrioridad(+value)}
        />

        <Select
          title="Asignado a"
          options={usuarios.map((u) => ({
            value: u.id,
            label: `${u.nombre} ${u.apellido}`,
          }))}
          value={usuario}
          onChange={(value) => setUsuario(+value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded-md cursor-pointer">
            Cancelar
          </button>
          <button onClick={PostTarea} className="bg-secondary px-4 py-2 rounded-md cursor-pointer">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}