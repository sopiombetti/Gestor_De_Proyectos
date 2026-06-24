import CardProyecto from "@/components/admin/CardProyecto";
import MensajeError from "@/components/ui/Error";
import ProyectoForm from "@/components/admin/ProyectoForm";
import Success from "@/components/ui/Success";
import { useProyectos } from "@/hooks/useProyectos";
import { useUserContext } from "@/utils/userContext";
import {  useState } from "react";

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
        <div className="mx-20 mt-6 rounded-2xl border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-700">Filas con errores:</p>
          <ul className="mt-2 space-y-1">
            {erroresFilas.map((e) => (
              <li key={e.fila} className="text-sm text-red-700">
                <span className="font-semibold">Fila {e.fila}:</span> {e.mensajes.join(" · ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col my-20 mx-30 space-y-10">
        <div className="flex justify-between">
          <h1 className="font-bold text-4xl">Panel Administración</h1>
          <button
            className="flex justify-center w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-blue-400"
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
        ) : (
          <></>
        )}
        {proyectos.map((proyecto) => (
          <CardProyecto proyecto={proyecto} setError={setError} key={proyecto.id} setSuccess={setSuccess} />
        ))}
      </div>
    </>
  );
}