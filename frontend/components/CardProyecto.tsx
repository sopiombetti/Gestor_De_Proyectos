import { ApiGetReporte, ApiGetTareasProyecto } from "@/utils/api"
import { useUserContext } from "@/utils/userContext"
import { useState } from "react"
import ModalEditarTarea from "./ModalEditTarea"

type Usuario = {
  id: number
  nombre: string
  apellido: string
  email: string
  rol_admin: boolean
}

type Proyecto = {
  id: number
  titulo: string
  descripcion: string
  fechaCreacion: string
  lider: Usuario
}

export default function CardProyecto({ proyecto }: { proyecto: Proyecto }) {

  const { token } = useUserContext();
  const [tareas, setTareas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<any>(null);

  const handleDownload = async () => {
    try {
      const response = await ApiGetReporte(proyecto.id, token);

      if (!response.ok) {
        throw new Error("No se puede obtener el reporte");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error(error);
    }

  }

  async function getTareasProyecto() {
    try {
      const response = await ApiGetTareasProyecto(proyecto.id, token);
      console.log(response);
      if (!response.ok) {
          throw new Error();
      }
      const data = await response.json();
      setTareas(data);
    }
    catch (err) {
      console.error(err);
    }
  }

  const abrirModalEditar = (tarea: any) => {
    setTareaSeleccionada(tarea);
    setModalAbierto(true);
  };

  return (
    <>
    <div className="flex flex-col space-y-3 border border-2 rounded-xl border-primary p-6">
      <h2 className="text-xl font-semibold">{proyecto.titulo}</h2>
      <p>{proyecto.descripcion}</p>
      <p>Creado el: {proyecto.fechaCreacion.slice(0, 10)}</p>
      <button onClick={handleDownload} className="flex mt-6 justify-center w-[200px] rounded-full bg-primary px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm cursor-pointer hover:bg-violet-400">Generar Informe</button>
      <button onClick={getTareasProyecto} className="flex mt-6 max-w-[150px] justify-center border-2 border-primary rounded-md px-2 cursor-pointer hover:border-violet-600 hover:border-2">Mostrar tareas</button>
      <div className="flex flex-col mt-6 space-y-2 divide-y divide-secondary">
      {tareas ? tareas.map(tarea => <div key={tarea.id} className="flex items-center justify-between p-1">
        <h4>{tarea.titulo}</h4>
        {tarea.usuario ? <p>{tarea.usuario.nombre} {tarea.usuario.apellido}</p> : <p className="text-secondary">Sin asignar</p>}
        <button onClick={() => abrirModalEditar(tarea)} className="cursor-pointer"><img src="/edit.svg"></img></button>
      </div>) : <></>}
      </div>
    </div>
    {modalAbierto && tareaSeleccionada && (<ModalEditarTarea tarea={tareaSeleccionada} onClose={() => setModalAbierto(false)}/>)}
    </>
  )
}


