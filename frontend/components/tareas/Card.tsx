import { useRouter } from "next/router"

type Tarea = {
    id: number
    titulo: string
    descripcion: string
    prioridad: {
        id: number
        nombre: string
    }
    estado: {
        id: number
        nombre: string
        codigo: string
    }
    proyectoid: number
}

export default function Card({ tarea }: { tarea: Tarea }) {
    const router = useRouter();
    return (
        <div className="grid gap-4 items-center shadow-md h-auto min-h-16 rounded-md px-4 sm:px-8 md:px-16 py-3 sm:py-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            style={{ gridTemplateColumns: 'minmax(0,1fr) 190px 130px' }}>
            <h3
                className="font-semibold hover:underline cursor-pointer truncate text-gray-900 dark:text-white"
                onClick={() => router.push(`/taskDetail?id=${tarea.id}`)}
            >
                {tarea.titulo}
            </h3>
            <h4 className={`py-1 rounded-sm w-18 text-center text-sm font-medium
            ${tarea.prioridad.nombre === "Alta"
                    ? "text-red-700 bg-red-300 dark:text-red-200 dark:bg-red-800/60"
                    : tarea.prioridad.nombre === "Media"
                        ? "text-orange-800 bg-orange-200 dark:text-orange-200 dark:bg-orange-800/60"
                        : "text-yellow-800 bg-yellow-200 dark:text-yellow-200 dark:bg-yellow-800/60"
                }`}>
                {tarea.prioridad.nombre}
            </h4>
            <h4 className="bg-secondary/75 dark:bg-secondary/90 min-w-25 text-center py-1 px-2 rounded-sm text-white text-sm">
                {tarea.estado.nombre}
            </h4>
        </div>
    )
}