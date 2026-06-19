"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import Card from "@/components/Card";
import { ApiGetTareas } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import BoxTareas from "@/components/BoxTareas";
import MensajeError from "@/components/Error";

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  estado:{
    id: number
    nombre: string
    codigo: string
  }
  prioridad:{
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
      <div className="mx-10 md:mx-20 mt-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Hola, {user?.nombre}</h2>
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center p-10 w-full md:w-3/4">
              <BoxTareas nombre={"Asignadas"} cantidad={tareas.filter((tarea) => tarea.estado.codigo === "ASIGNADA").length} />
              <BoxTareas nombre={"En Progreso"} cantidad={tareas.filter((tarea) => tarea.estado.codigo === "EN_PROGRESO").length} />
              <BoxTareas nombre={"Finalizadas"} cantidad={tareas.filter((tarea) => tarea.estado.codigo === "FINALIZADA").length} />
            </div>
          </div>
        </section>
        <section className="flex items-center my-14 bg-gray-300 rounded-lg h-18  w-3/4 md:w-[450px] border border-secondary">
          <h3 className="mr-20 ml-10 font-semibold text-lg">Filtrar Tareas</h3>
          <select className="w-40 bg-white" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="">Todas</option>
            <option value="1">Prioridad Baja</option>
            <option value="2">Prioridad Media</option>
            <option value="3">Prioridad Alta</option>
          </select>
        </section>
        <section className="flex flex-col space-y-5 mt-16 mb-16">
          {tareas.map(tarea => <Card tarea={tarea} key={tarea.id} />)}
        </section>
      </div>
    </>
  )
}