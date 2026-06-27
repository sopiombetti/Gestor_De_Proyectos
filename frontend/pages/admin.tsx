import CardProyecto from "@/components/admin/CardProyecto";
import MensajeError from "@/components/ui/Error";
import ProyectoForm from "@/components/admin/ProyectoForm";
import Success from "@/components/ui/Success";
import { useProyectos } from "@/hooks/useProyectos";
import { useUserContext } from "@/utils/userContext";
import { useState } from "react";

type ErrorFila = { fila: number; mensajes: string[] };

export default function Admin() {
  const [show, setShow] = useState(false);
  const { user, token } = useUserContext();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [erroresFilas, setErroresFilas] = useState<ErrorFila[]>([]);

  const { proyectos, setProyectos } = useProyectos(user?.id, token);

  function handleCreate() {
    setShow(true);
  }

  return (
    <>
      {error && <MensajeError text={error} />}
      {success && <Success text={success} />}

      {erroresFilas.length > 0 && (
        <div className="mx-4 sm:mx-8 lg:mx-20 mt-6 rounded-2xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4">
          <p className="font-semibold text-red-700 dark:text-red-300">
            Filas con errores:
          </p>
          <ul className="mt-2 space-y-1">
            {erroresFilas.map((e) => (
              <li
                key={e.fila}
                className="text-sm text-red-700 dark:text-red-300 break-words"
              >
                <span className="font-semibold">Fila {e.fila}:</span>{" "}
                {e.mensajes.join(" · ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col my-10 sm:my-16 lg:my-20 mx-4 sm:mx-8 lg:mx-20 xl:mx-30 space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900">
            Panel Administración
          </h1>
          <button
            className="w-full sm:w-[200px] flex justify-center rounded-full bg-secondary px-4 py-2 font-semibold text-white shadow-sm cursor-pointer hover:bg-blue-400 transition"
            onClick={handleCreate}
          >
            + Crear Proyecto
          </button>
        </div>
        {show ? (
          <ProyectoForm
            onProyectoCreado={(nuevoProyecto) =>
              setProyectos((prev) => [...prev, nuevoProyecto])
            }
            onClose={() => setShow(false)}
            setError={setError}
            setErroresFilas={setErroresFilas}
          />
        ) : null}
        <div className="space-y-6">
          {proyectos.map((proyecto) => (
            <CardProyecto
              proyecto={proyecto}
              setError={setError}
              key={proyecto.id}
              setSuccess={setSuccess}
            />
          ))}
        </div>
      </div>
    </>
  );
}