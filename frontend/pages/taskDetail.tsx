"use client";
import MensajeError from "@/components/ui/Error";
import { ApiEditarTarea, ApiGetTareaPorId } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import Select from "@/components/ui/Select";
import Success from "@/components/ui/Success";
import Input from "@/components/ui/Input";

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  estimacion: number
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
  tiempoFinal: number
}

type Cambios = {
  idEstado: number
  estimacion: number
  tiempoFinal: number
}

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useUserContext();
  const [tarea, setTarea] = useState<Tarea>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(0);
  const [estimacionCalculada, setEstimacionCalculada] = useState(0);
  const [tiempoFinal, setTiempoFinal] = useState(0);

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

  const handleGuardar = async () => {
    if (!tarea) return;
    try {
      const cambios: Cambios = {
        idEstado: tarea.estado.id,
        estimacion: tarea.estimacion,
        tiempoFinal: tarea.tiempoFinal
      };

      if (estadoSeleccionado !== tarea.estado.id) {
        cambios.idEstado = estadoSeleccionado;
      }

      if (estimacionCalculada !== (tarea.estimacion ?? 0)) {
        cambios.estimacion = estimacionCalculada;
      }

      if (tiempoFinal !== (tarea.tiempoFinal ?? 0)) {
        cambios.tiempoFinal = tiempoFinal;
      }

      if (Object.keys(cambios).length === 0) {
        setError("No hay cambios para guardar.");
        return;
      }

      const response = await ApiEditarTarea(
        tarea.id,
        cambios,
        token
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message || "No se pudieron guardar los cambios.");
        return;
      }

      setTarea((prev: any) => ({
        ...prev,
        estado: cambios.idEstado
          ? { ...prev.estado, id: cambios.idEstado }
          : prev.estado,
        estimacion:
          cambios.estimacion !== undefined
            ? cambios.estimacion
            : prev.estimacion,
      }));

      setSuccess("Los cambios se guardaron correctamente.");
    } catch (error) {
      console.error(error);
      setError("Ocurrió un error al guardar.");
    }
  };

  if (!tarea) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {error && <MensajeError text={error} />}
      {success && <Success text={success} />}
      <div className="flex flex-col max-w-3xl mx-auto p-6">
        <Link href="/home" className="text-sm text-center border-1 border-secondary rounded-md w-[130px] p-2 hover:ring-2">Volver al inicio</Link>
        <div className="pb-4 mt-8">
          <h1 className="text-2xl font-bold text-secondary">
            {tarea.titulo}
          </h1>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <img src="/check.svg" alt="check" className="w-5" />
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
        </div>
        <div className="mt-8">
          <div className="flex items-center space-x-2">
            <img src="/check.svg" alt="check" className="w-5" />
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
            <img src="/check.svg" alt="check" className="w-5" />
            <h2 className="text-lg font-semibold text-gray-800">
              Estimación:
            </h2>
            <p>{tarea.estimacion ?? 0} horas</p>
          </div>
          <Calculator
            devolverResultado={(valor) => setEstimacionCalculada(valor)}
          />
        </div>
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <img src="/check.svg" alt="check" className="w-5" />
            <h2 className="text-lg font-semibold text-gray-800">
              Tiempo final de duración:
            </h2>
          </div>
          <Input
            title=""
            type="number"
            value={tiempoFinal}
            onChange={(e) => setTiempoFinal(Number(e.target.value))}
          />
        </div>
        <div className="mt-8 mb-6">
          <button onClick={handleGuardar} className="flex justify-center w-[200px] rounded-full bg-primary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-violet-400">Guardar cambios</button>
        </div>
      </div>
    </>
  );
}