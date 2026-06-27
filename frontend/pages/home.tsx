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

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-8 md:px-16 lg:px-32 pt-8 sm:pt-10 pb-16">

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

        <section className="w-full max-w-lg mt-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-lg rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔎</span>
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                Filtrar tareas
              </h3>
            </div>
            <select
              className="w-full sm:w-56 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-xl px-4 py-2.5 border border-gray-300 dark:border-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="1">Prioridad baja</option>
              <option value="2">Prioridad media</option>
              <option value="3">Prioridad alta</option>
            </select>
          </div>
        </section>

        <section className="flex flex-col space-y-4 sm:space-y-5 mt-8 sm:mt-16">
          {tareas.map(tarea => <Card tarea={tarea} key={tarea.id} />)}
        </section>

      </div>
    </>
  )
}