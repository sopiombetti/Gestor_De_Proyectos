import CardProyecto from "@/components/CardProyecto";
import MensajeError from "@/components/Error";
import { ApiGetProyecto, ApiCrearProyecto, ApiCrearTareasBulk, ApiGetTareasProyecto } from "@/utils/api";
import { parsearArchivoTareas } from "@/utils/parsearArchivo";
import { useUserContext } from "@/utils/userContext";
import { useEffect, useState } from "react";

type ErrorFila = { fila: number; mensajes: string[] };

export default function Admin() {
  const [proyectos, setProyectos] = useState([]);
  const [show, setShow] = useState(false);
  const { user, token } = useUserContext();
  const [error, setError] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [erroresFilas, setErroresFilas] = useState<ErrorFila[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    async function obtenerProyecto() {
      try {
        const response = await ApiGetProyecto(user.id, token);
        if (!response.ok) {
          setError("No se pudieron obtener los proyectos.");
          return;
        }
        const data = await response.json();
        setProyectos(data);
      } catch (err) {
        console.error(err);
      }
    }
    obtenerProyecto();
  }, [user, token]);

  function handleCreate() {
    setShow(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErroresFilas([]);

    if (!user?.id) {
      setError("No se pudo identificar al usuario. ¿Iniciaste sesión?");
      return;
    }

    try {
      const resProyecto = await ApiCrearProyecto(
        { titulo, descripcion, idLider: Number(user.id) },
        token,
      );
      if (!resProyecto.ok) {
        const err = await resProyecto.json().catch(() => null);
        const msg = err?.message;
        setError(Array.isArray(msg) ? msg.join(" — ") : msg ?? "No se pudo crear el proyecto.");
        return;
      }
      const proyecto = await resProyecto.json();

      if (file) {
        const tareas = await parsearArchivoTareas(file);
        const resBulk = await ApiCrearTareasBulk({ idProyecto: proyecto.id, tareas }, token);

        if (!resBulk.ok) {
          const detalle = await resBulk.json();
          setError(detalle.mensaje ?? "Hay filas con errores en el archivo.");
          setErroresFilas(detalle.errores ?? []);
          return;
        }
      }

      setProyectos((prev) => [...prev, proyecto]);
      setShow(false);
      setTitulo("");
      setDescripcion("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error procesando el archivo. Volvé a seleccionarlo y reintentá.");
    }
  }



  return (
    <>
      {error && <MensajeError text={error} />}

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

      <div className="flex flex-col m-20 space-y-10">
        <div className="flex flex-col space-y-6">
          <h1 className="font-bold text-2xl">Panel Administración</h1>
          <button
            className="flex justify-center w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-blue-400"
            onClick={handleCreate}
          >
            Crear Proyecto
          </button>
        </div>
        {show ? (
          <div className="flex bg-gray-200 rounded-2xl p-6">
            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
              <label>Título:</label>
              <input
                className="bg-white rounded-md w-[500px] p-2"
                type="text" placeholder="Título"
                value={titulo} onChange={(e) => setTitulo(e.target.value)}
              />
              <label>Descripción:</label>
              <input
                className="bg-white rounded-md w-[500px] p-2"
                type="text" placeholder="Descripción"
                value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              />
              <label>Subir archivo (.xls / .csv)</label>
              <input
                className="bg-white rounded-md w-[500px] p-2"
                type="file" accept=".xls,.xlsx,.csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="submit"
                className="flex justify-center w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold text-white cursor-pointer hover:bg-blue-400"
              >
                Guardar
              </button>
            </form>
          </div>
        ) : (
          <></>
        )}
        {proyectos.map((proyecto) => (
          <CardProyecto proyecto={proyecto} key={proyecto.id} />
        ))}
      </div>
    </>
  );
}