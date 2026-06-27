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
          const data = await response.json().catch(() => null);
          setError(
            data?.message || "No se pudo obtener la tarea."
          );
          return;
        }

        const data = await response.json();
        setTarea(data);
        setEstadoSeleccionado(data.estado.id);
        setEstimacionCalculada(data.estimacion ?? 0);

      } catch (error) {
        console.error(error);
        setError("Error inesperado al obtener la tarea.");
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
      <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 p-8">
          <Link
            href="/home"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
          >
            ← Volver al inicio
          </Link>
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {tarea.titulo}
            </h1>
            <span className="px-6 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {tarea.prioridad.nombre}
            </span>
          </div>
          <div className="mt-8 space-y-8">
            <section className="border-b border-gray-200 dark:border-slate-700 pb-6">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                Descripción
              </h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {tarea.descripcion}
              </p>
            </section>
            <section className="border-b border-gray-200 dark:border-slate-700 pb-6">
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
            </section>
            <section className="border-b border-gray-200 dark:border-slate-700 pb-6">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                Estimación
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {tarea.estimacion ?? 0} horas
              </p>
              <Calculator
                devolverResultado={(valor) => setEstimacionCalculada(valor)}
              />
            </section>
            <section>
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
                Tiempo final de duración
              </h2>
              <Input
                title=""
                type="number"
                value={tiempoFinal}
                onChange={(e) => setTiempoFinal(Number(e.target.value))}
              />
            </section>
          </div>
          <div className="mt-10">
            <button
              onClick={handleGuardar}
              className="w-full sm:w-56 bg-secondary cursor-pointer text-white py-2 rounded-xl font-semibold hover:bg-blue-500 hover:scale-105 transition-all shadow-lg"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </>
  );
}