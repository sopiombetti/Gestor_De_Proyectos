import { useState } from "react";
import Button from "./Button";
import Select from "./Select";
import Calculator from "./Calculator";
import { ApiEditarTarea } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

interface TaskDetailProps {
  id: number;
  title: string;
  description: string;
  estado: number;
  prioridad: string;
  estimacion?: number;
}

export default function TaskDetail({
  id,
  title,
  description,
  estado,
  prioridad,
  estimacion,
}: TaskDetailProps) {
  const { token } = useUserContext();

  const [estadoSeleccionado, setEstadoSeleccionado] =
    useState(estado);

  const [estimacionCalculada, setEstimacionCalculada] =
    useState(estimacion ?? 0);

  const tareaFinalizada = estadoSeleccionado === 3;

  const handleGuardarEstado = async () => {
    if (!token) return;

    await ApiEditarTarea(
      id,
      {
        idEstado: estadoSeleccionado,
      },
      token
    );

  };

  const handleGuardarEstimacion = async () => {
    if (!token) return;

    await ApiEditarTarea(
      id,
      {
        estimacion: estimacionCalculada,
      },
      token
    );


  };


  return (
    <div className="max-w-2xl mx-auto bg-white p-6">

      <div className="pb-4 mb-6">
        <h1 className="text-3xl font-bold">
          {title}
        </h1>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Descripción
        </h2>

        <p className="whitespace-pre-line">
          {description}
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
          {prioridad}
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
  );
}