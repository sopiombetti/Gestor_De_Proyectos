import { ApiGetReporte, ApiGetTareasProyecto } from "@/utils/api"
import { useUserContext } from "@/utils/userContext"
import { useState } from "react"
import ModalEditarTarea from "./ModalEditTarea"
import ModalEditarProyecto from "./ModalEditProyecto"

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

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  prioridad: {
    id: number
    nombre: string
  }
  usuario: {
    id: number
    nombre: string
    apellido: string
    email: string
    rol_admin: boolean
  }
}

export default function CardProyecto({ proyecto }: { proyecto: Proyecto }) {

  const { token } = useUserContext();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarTareas, setMostrarTareas] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea>();
  const [modalProyectoAbierto, setModalProyectoAbierto] = useState(false);
  const [proyectoActual, setProyectoActual] = useState(proyecto); 

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
    if (mostrarTareas) {
      setMostrarTareas(false);
      return;
    }
    try {
      const response = await ApiGetTareasProyecto(proyecto.id, token);
      console.log(response);
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      setTareas(data);
      setMostrarTareas(true);
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
      <div className="flex flex-col space-y-3 border border-2 rounded-xl border-primary p-5">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{proyecto.titulo}</h2>
          <img src="/edit.svg" alt="Editar proyecto" onClick={() => setModalProyectoAbierto(true)} className="cursor-pointer"/>
        </div>
        
        <p>{proyecto.descripcion}</p>
        <div className="flex space-x-3 items-center">
          <img src="/calendar.svg" className="h-5" />
          <p>Creado el: {proyecto.fechaCreacion.slice(0, 10)}</p>
        </div>

        <div className="flex space-x-5">
          <button onClick={handleDownload} className="flex items-center mt-6 justify-center w-[200px] rounded-full bg-primary p-3 space-x-2 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm cursor-pointer hover:bg-violet-400">
            <img src="/report.svg" className="h-5" />
            <p>Generar Informe</p>
          </button>
          <button onClick={getTareasProyecto} className="flex items-center mt-6 max-w-[170px] font-semibold justify-center border-2 border-primary rounded-md space-x-2 p-2 cursor-pointer hover:border-violet-600 hover:border-2">
            <img src="/list.svg" className="h-5" />
            <p>{mostrarTareas ? "Ocultar tareas" : "Mostrar tareas"}</p>
          </button>
        </div>

        {mostrarTareas && (
          <div className="flex flex-col mt-6">
            <div className="grid gap-4 px-1 pb-2 border-b border-secondary text-sm text-secondary font-medium" style={{ gridTemplateColumns: 'minmax(0,1fr) 180px 100px' }}>
              <span>Tarea</span>
              <span>Usuario</span>
              <span className="text-right">Acciones</span>
            </div>

            <div className="flex flex-col divide-y divide-secondary">
              {tareas.map(tarea => (
                <div key={tarea.id} className="grid gap-4 items-center p-2" style={{ gridTemplateColumns: 'minmax(0,1fr) 180px 100px' }}>
                  <h4 className="truncate">{tarea.titulo}</h4>
                  {tarea.usuario
                    ? <p>{tarea.usuario.nombre} {tarea.usuario.apellido}</p>
                    : <p className="text-secondary">Sin asignar</p>}
                  <button onClick={() => abrirModalEditar(tarea)} className="cursor-pointer flex justify-end">
                    <img src="/edit.svg" alt="Editar tarea" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {modalAbierto && tareaSeleccionada && (<ModalEditarTarea tarea={tareaSeleccionada} onClose={() => setModalAbierto(false)} onGuardado={getTareasProyecto} />)}
      {modalProyectoAbierto && (<ModalEditarProyecto proyecto={proyectoActual} onClose={() => setModalProyectoAbierto(false)} onGuardado={(p) => setProyectoActual(p)}/>)}
    </>
  )
}


