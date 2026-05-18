import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import Card from "@/components/Card";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  const tareas = [
    {
      id: 1,
      titulo: "Hacer Home",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      prioridad: "Alta",
      estado: "En Progreso",
      proyectoid: 2
    },
    {
      id: 2,
      titulo: "Hacer Login",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      prioridad: "Media",
      estado: "En Revisión",
      proyectoid: 2
    },
    {
      id: 3,
      titulo: "Hacer BDD",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      prioridad: "Baja",
      estado: "Asignada",
      proyectoid: 3
    },
  ]

  return (
    <div className="mx-10 md:mx-20 mt-10">
      <section>
        <h2 className="text-2xl font-bold text-gray-900">Mis Tareas</h2>
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center p-10 w-full md:w-3/4">
            <div className="flex flex-col justify-between rounded-lg shadow-2xl h-30 w-30 md:h-30 md:w-40 p-5 border border-secondary">
              <h3 className="font-bold">Asignadas</h3>
              <div className="flex justify-between">
                <h3 className="font-bold text-xl md:text-3xl">10</h3>
                <Image src="/check.svg" alt="check"/>
              </div>
              
            </div>
            <div className="flex flex-col justify-between rounded-lg shadow-2xl h-30 w-30 md:h-30 md:w-40 p-5 border border-secondary">
              <h3 className="font-bold">En Proceso</h3>
              <div className="flex justify-between">
                <h3 className="font-bold text-xl md:text-3xl">5</h3>
                <Image src="/check.svg" alt="check"/>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg shadow-2xl h-30 w-30 md:h-30 md:w-40 p-5 border border-secondary">
              <h3 className="font-bold">En Revisión</h3>
              <div className="flex justify-between">
                <h3 className="font-bold text-xl md:text-3xl">3</h3>
                <Image src="/check.svg" alt="check"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center my-14 bg-gray-300 rounded-lg h-18  w-3/4 md:w-1/2 border border-secondary">
        <h3 className="mr-20 ml-10 font-semibold text-xl">Filtrar Tareas</h3>
        <select className="w-40">
          <option value="value1">Todas</option>
          <option value="value1">Prioridad Alta</option>
          <option value="value2">Prioridad Media</option>
          <option value="value3">Prioridad Baja</option>
        </select>
      </section>
      <section className="flex flex-col space-y-5 mt-16 mb-16">
        {tareas.map(tarea => <Card tarea={tarea} key={tarea.id}/>)}
      </section>
    </div>
  )
}