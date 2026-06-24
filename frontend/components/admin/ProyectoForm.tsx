import { ApiCrearProyecto, ApiCrearTareasBulk } from "@/utils/api";
import { parsearArchivoTareas } from "@/utils/parsearArchivo";
import { useUserContext } from "@/utils/userContext";
import { useState } from "react";

type ErrorFila = { fila: number; mensajes: string[] };

type Usuario = {
    id: number
    nombre: string
    apellido: string
    email: string
    rol_admin: boolean
}

type Proyecto = {
    id: number
    titulo: string
    descripcion: string
    fechaCreacion: string
    lider: Usuario
}

type ProyectoFormProps = {
    onProyectoCreado: (proyecto: Proyecto) => void;
    onClose: () => void;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setErroresFilas: React.Dispatch<React.SetStateAction<ErrorFila[]>>;
};

export default function ProyectoForm({ onProyectoCreado, onClose, setError, setErroresFilas, }: ProyectoFormProps) {
    const { user, token } = useUserContext();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [file, setFile] = useState<File | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setErroresFilas([]);

        try {
            if (!user) return;
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
                    console.log(detalle);
                    setError(detalle.mensaje ?? "Hay filas con errores en el archivo.");
                    setErroresFilas(detalle.errores ?? []);
                    return;
                }
            }

            onProyectoCreado(proyecto);
            onClose();
            setTitulo("");
            setDescripcion("");
            setFile(null);

        } catch (err) {
            console.error(err);
            setError("Ocurrió un error procesando el archivo. Volvé a seleccionarlo y reintentá.");
        }
    }

    return (
        <div className="flex border-1 border-gray-800 rounded-2xl p-6 shadow-xl">
            <form className="flex flex-col w-full space-y-3" onSubmit={handleSubmit}>
                <label>Título:</label>
                <input
                    className="bg-white rounded-md p-2 border-1 border-secondary shadow-xl"
                    type="text" placeholder="Título"
                    value={titulo} onChange={(e) => setTitulo(e.target.value)}
                />
                <label>Descripción:</label>
                <textarea
                    className="bg-white rounded-md p-2 border-1 border-secondary shadow-xl"
                    placeholder="Descripción"
                    value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                />
                <label>Subir archivo (.xls / .csv)</label>
                <input
                    className="bg-white rounded-md p-2 border-1 border-secondary shadow-xl"
                    type="file" accept=".xls,.xlsx,.csv"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button
                    type="submit"
                    className="flex justify-center mt-4 w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold text-white cursor-pointer hover:bg-blue-400"
                >
                    Guardar
                </button>
            </form>
        </div>
    )
}