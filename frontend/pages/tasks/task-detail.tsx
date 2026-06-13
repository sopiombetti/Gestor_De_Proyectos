import TaskDetail from "@/components/TaskDetail";
import Error from "@/components/Error";
import { ApiGetTareaPorId } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useUserContext();

  const [tarea, setTarea] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !token) return;

    const obtenerTarea = async () => {
      try {
        const response = await ApiGetTareaPorId(Number(id), token);

        if (!response.ok) {
          setError("No se encontró la tarea.");
          return;
        }

        const data = await response.json();
        setTarea(data);
      } catch (err) {
        setError("No se ha encontrado la tarea.");
      }
    };

    obtenerTarea();
  }, [id, token]);

  if (error) {
    return <Error text={error} />;
  }
if (!tarea) {
  return <div>Cargando...</div>;
}

  return (
    <TaskDetail
      id={tarea.id}
      title={tarea.titulo}
      description={tarea.descripcion}
      estado={tarea.estado.id}
      prioridad={tarea.prioridad.nombre}
      estimacion={tarea.estimacion}
    />
  );
}