import MensajeError from "@/components/Error";
import { ApiEditarTarea, ApiGetTareaPorId } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Calculator from "@/components/Calculator";
import Select from "@/components/Select";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useUserContext();
  const [tarea, setTarea] = useState<any>(null);
  const [error, setError] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(tarea.estado.id);
  const [estimacionCalculada, setEstimacionCalculada] = useState(tarea.estimacion ?? 0);
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
      }
    } 
    catch(error){
        console.error(error);
    }
  };
  
  const handleGuardarEstimacion = async () => {
      try{
        const response = await ApiEditarTarea(
            tarea.id,
            {
              estimacion: estimacionCalculada,
            },
            token
          );
        if (!response.ok) {
          setError("No se pudo guardar la estimación.");
        }
      } 
      catch(error){
        console.error(error);
      }
    };

  return (
    <>
    {error && <MensajeError text={error}/>}
    <Link href="/home">Volver al inicio</Link>
    <div className="max-w-2xl mx-auto bg-white p-6">
    
          <div className="pb-4 mb-6">
            <h1 className="text-3xl font-bold">
              {tarea.title}
            </h1>
          </div>
    
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Descripción
            </h2>
    
            <p className="whitespace-pre-line">
              {tarea.description}
            </p>
          </div>
    
          <div className="mb-8">
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
    
          <div className="mb-8">
            <h2 className="text-lg mb-2">
              Prioridad
            </h2>
    
            <span className="px-3 py-1">
              {tarea.prioridad}
            </span>
          </div>
    
          <div className="mb-8">
            <Calculator
              devolverResultado={(valor) =>
                setEstimacionCalculada(valor)
              }
            />
    
            <div className="mt-4">
              <span className="px-3 py-1">
                Estimación: {estimacionCalculada} horas
              </span>
            </div>
    
            <div className="mt-4">
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