"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import Card from "@/components/Card";
import { ApiGetTareas } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import BoxTareas from "@/components/BoxTareas";

export default function Home() {

  const [tareas, setTareas] = useState([]);
  const [prioridad, setPrioridad] = useState("");
  const { user, token } = useUserContext();

  useEffect(() => {
    console.log(user);
    async function obtenerTareas(){
      try {
          const response = await ApiGetTareas(user?.id, prioridad, token);
      
          if (!response.ok) {
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
    <div className="mx-10 md:mx-20 mt-10">
      <section>
        <h2 className="text-2xl font-bold text-gray-900">Hola, {user?.nombre}</h2>
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center p-10 w-full md:w-3/4">
            <BoxTareas nombre={"Asignadas"} cantidad={tareas.filter((tarea) => tarea.estado.nombre === "Asignada").length}/>
            <BoxTareas nombre={"En Progreso"} cantidad={tareas.filter((tarea) => tarea.estado.nombre === "En progreso").length}/>
            <BoxTareas nombre={"Finalizadas"} cantidad={tareas.filter((tarea) => tarea.estado.nombre === "Finalizada").length}/>
          </div>
        </div>
      </section>
      <section className="flex items-center my-14 bg-gray-300 rounded-lg h-18  w-3/4 md:w-[450px] border border-secondary">
        <h3 className="mr-20 ml-10 font-semibold text-lg">Filtrar Tareas</h3>
        <select className="w-40" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="">Todas</option>
          <option value="1">Prioridad Alta</option>
          <option value="2">Prioridad Media</option>
          <option value="4">Prioridad Baja</option>
        </select>
      </section>
      <section className="flex flex-col space-y-5 mt-16 mb-16">
        {tareas.map(tarea => <Card tarea={tarea} key={tarea.id}/>)}
      </section>
    </div>
  )
}