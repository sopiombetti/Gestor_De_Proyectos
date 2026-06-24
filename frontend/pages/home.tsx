"use client";
import { useEffect, useState } from "react";
import Card from "@/components/tareas/Card";
import { ApiGetTareas } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import BoxTareas from "@/components/tareas/BoxTareas";
import MensajeError from "@/components/ui/Error";

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  estado: {
    id: number
    nombre: string
    codigo: string
  }
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
  proyectoid: number
}

export default function Home() {

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [prioridad, setPrioridad] = useState("");
  const { user, token } = useUserContext();
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(user);
    async function obtenerTareas() {
      try {
        if (!user) return;
        const response = await ApiGetTareas(user.id, prioridad, token);

        if (!response.ok) {
          setError("No se pudieron obtener las tareas.");
          throw new Error("No se pueden obtener las tareas");
        }

        const data = await response.json();
        setTareas(data);
      }
      catch (error) {
        console.error(error);
      }
    }
    obtenerTareas();

  }, [user, prioridad]);


  return (
    <>
      {error && <MensajeError text={error} />}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 md:px-16 lg:px-24 pt-8 sm:pt-10 pb-16">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hola, {user?.nombre}
          </h2>
          <div className="flex flex-col items-center">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 sm:p-10 w-full md:w-3/4">
              <BoxTareas
                nombre={"Asignadas"}
                cantidad={tareas.filter((tarea) => tarea.estado.codigo === "ASIGNADA").length}
              />
              <BoxTareas
                nombre={"En Progreso"}
                cantidad={tareas.filter((tarea) => tarea.estado.codigo === "EN_PROGRESO").length}
              />
              <BoxTareas
                nombre={"Finalizadas"}
                cantidad={tareas.filter((tarea) => tarea.estado.codigo === "FINALIZADA").length}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col sm:flex-row items-start sm:items-center my-8 sm:my-14 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 sm:h-18 w-full sm:max-w-md border border-secondary gap-3 sm:gap-0">
          <h3 className="sm:mr-6 sm:ml-4 font-semibold text-lg text-gray-900 dark:text-white whitespace-nowrap">
            Filtrar Tareas
          </h3>
          <select
            className="w-full sm:w-44 bg-white dark:bg-gray-800 dark:text-white rounded-md px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 focus:outline-blue-400"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="1">Prioridad Baja</option>
            <option value="2">Prioridad Media</option>
            <option value="3">Prioridad Alta</option>
          </select>
        </section>

        <section className="flex flex-col space-y-4 sm:space-y-5 mt-8 sm:mt-16">
          {tareas.map(tarea => <Card tarea={tarea} key={tarea.id} />)}
        </section>

      </div>
    </>
  )
}