"use client";
import MensajeError from "@/components/Error";
import { ApiEditarTarea, ApiGetTareaPorId } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Calculator from "@/components/Calculator";
import Select from "@/components/Select";
import Success from "@/components/success";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useUserContext();
  const [tarea, setTarea] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(0);
  const [estimacionCalculada, setEstimacionCalculada] = useState(0);
  const tareaFinalizada = estadoSeleccionado === 4;
  
  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const response = await ApiGetTareaPorId(Number(id), token);
        if (!response.ok) {
          setError("No se pudo obtener la tarea.");
          return;
        }
        const data = await response.json();
        console.log(data);
        setTarea(data);
        setEstadoSeleccionado(data.estado.id);
        setEstimacionCalculada(data.estimacion ?? 0);
      } 
      catch (error) {
          console.error(error);
      }
    };
    obtenerTarea();
  }, [id, token]);

  const handleGuardarEstado = async () => {
    try{
      const response = await ApiEditarTarea(
        tarea.id,
        {
          idEstado: estadoSeleccionado,
        },
        token
      );
      if (!response.ok) {
        setError("No se pudo actualizar el estado.");
        throw new Error("No se pudo actualizar el estado.");
      }
      setSuccess("El estado se guardó correctamente.");
    } 
    catch(error){
        console.error(error);
    }
  };
  
  const handleGuardarEstimacion = async () => {
      try{
        console.log(estimacionCalculada);
        const response = await ApiEditarTarea(
            tarea.id,
            {
              estimacion: estimacionCalculada,
            },
            token
          );
        if (!response.ok) {
          setError("No se pudo guardar la estimación.");
          throw new Error("No se pudo guardar la estimación.");
        }
        setSuccess("La estimación se guardó correctamente.");
      } 
      catch(error){
        console.error(error);
      }
    };

  if (!tarea) {
    return <div>Cargando...</div>;
  }

  return (
    <>
    {error && <MensajeError text={error}/>}
    {success && <Success text={success}/>}
    <div className="flex flex-col max-w-3xl mx-auto p-6">
      <Link href="/home" className="text-sm hover:text-blue-700">Volver al inicio</Link>
      <div className="pb-4 mt-8">
        <h1 className="text-2xl font-bold text-secondary">
          {tarea.titulo}
        </h1>
      </div>
      <div className="mt-4">
          <div className="flex items-center space-x-2">
            <img src="/check.svg" alt="check"/>
            <h2 className="text-lg font-semibold text-gray-800">
              Descripción:
            </h2>
          </div>
          <p className="whitespace-pre-line mt-2">
            {tarea.descripcion}
          </p>
        </div>
        <div className="mt-8">
          <Select
            title="Estado"
            options={[
              { value: 1, label: "No asignada" },
              { value: 2, label: "Asignada" },
              { value: 3, label: "En progreso" },
              { value: 4, label: "Finalizada" },
            ]}
            value={estadoSeleccionado}
            onChange={(value) =>
              setEstadoSeleccionado(Number(value))
            }
          />
          <div className="mt-4">
            <Button
              title="Guardar estado"
              type="button"
              onClick={handleGuardarEstado}
              disabled={tareaFinalizada}
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center space-x-2">
            <img src="/check.svg" alt="check"/>
            <h2 className="text-lg font-semibold text-gray-800">
              Prioridad:
            </h2>
            <span className="">
            {tarea.prioridad.nombre}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <img src="/check.svg" alt="check"/>
            <h2 className="text-lg font-semibold text-gray-800">
              Estimación: 
            </h2>
            <p>{tarea.estimacion ?? 0} horas</p>
          </div>
          <Calculator
            devolverResultado={(valor) => setEstimacionCalculada(valor)}
          />
          <div className="mt-6">
              <Button
                title="Guardar estimación"
                type="button"
                onClick={handleGuardarEstimacion}
                disabled={tareaFinalizada}
              />
            </div>
          </div>
    
        </div>
    </>
  );
}