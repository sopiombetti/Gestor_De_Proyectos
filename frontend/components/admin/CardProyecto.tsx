import { ApiDeleteProyecto, ApiGetTareasProyecto } from "@/utils/api"
import { useUserContext } from "@/utils/userContext"
import { useState } from "react"
import ModalEditarTarea from "./ModalEditTarea"
import ModalEditarProyecto from "./ModalEditProyecto"
import Swal from "sweetalert2";
import ReporteButton from "./ReporteButton"
import TaskForm from "../tareas/TaskForm"

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

type CardProyectoProps = {
    proyecto: Proyecto;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
};

export default function CardProyecto({ proyecto, setError, setSuccess }:CardProyectoProps ) {

  const { token } = useUserContext();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarTareas, setMostrarTareas] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea>();
  const [modalProyectoAbierto, setModalProyectoAbierto] = useState(false);
  const [proyectoActual, setProyectoActual] = useState(proyecto);
  const [modalCrearTarea, setModalCrearTarea] = useState(false);

  async function getTareasProyecto() {
    if (mostrarTareas) {
      setMostrarTareas(false);
      return;
    }
    try {
      const response = await ApiGetTareasProyecto(proyecto.id, token);
      console.log(response);
      if (!response.ok) {
        setError("No se pudieron obtener las tareas.")
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

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro de que desea eliminar el proyecto?",
        text: "Se eliminarán todas las tareas asociadas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
      if (!result.isConfirmed) return;

      const response = await ApiDeleteProyecto(proyecto.id, token, true);
      if (!response.ok) {
        console.log(response);
        setError("No se pudo eliminar el proyecto.")
        throw new Error("No se pudo eliminar el proyecto");
      }
      setSuccess("El proyecto se eliminó correctamente.")
      console.log(response);
    } catch (error) {
      console.error(error);
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
          <h2 className="text-xl font-semibold">{proyectoActual.titulo}</h2>
          <div className="flex space-x-5">
            <img src="/edit.svg" alt="Editar proyecto" onClick={() => setModalProyectoAbierto(true)} className="cursor-pointer" />
            <img src="/delete.svg" alt="Eliminar proyecto" onClick={handleDelete} className="cursor-pointer" />
          </div>
        </div>

        <p>{proyectoActual.descripcion}</p>
        <div className="flex space-x-3 items-center">
          <img src="/calendar.svg" className="h-5" />
          <p>Creado el: {proyecto.fechaCreacion.slice(0, 10)}</p>
        </div>

        <div className="flex space-x-5 items-end">
          <ReporteButton proyectoId={proyecto.id} setError={setError}/>
          <button onClick={getTareasProyecto} className="flex items-center mt-6 max-w-[170px] font-semibold justify-center border-2 border-primary rounded-md space-x-2 p-2 cursor-pointer hover:border-violet-600 hover:border-2">
            <img src="/list.svg" className="h-5" />
            <p>{mostrarTareas ? "Ocultar tareas" : "Mostrar tareas"}</p>
          </button>
          <button onClick={() => setModalCrearTarea(true)} className="flex items-center justify-center py-2 px-4 rounded-full bg-primary font-semibold text-white shadow-sm cursor-pointer hover:bg-violet-500">
            <p>+ Crear Tarea</p>
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
      {modalAbierto && tareaSeleccionada && (<ModalEditarTarea tarea={tareaSeleccionada} onClose={() => setModalAbierto(false)} onGuardado={getTareasProyecto} setError={setError} setSuccess={setSuccess}/>)}
      {modalProyectoAbierto && (<ModalEditarProyecto proyecto={proyectoActual} onClose={() => setModalProyectoAbierto(false)} onGuardado={(p) => setProyectoActual(p)} setError={setError} setSuccess={setSuccess}/>)}
      {modalCrearTarea && (<TaskForm idProyecto={proyectoActual.id} onClose={() => setModalCrearTarea(false)} setError={setError} setSuccess={setSuccess}/>)}
    </>
  )
}


