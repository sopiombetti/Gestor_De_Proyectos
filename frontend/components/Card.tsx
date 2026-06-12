type Objeto = {
    id: number
    nombre: string
}

type Tarea = {
  id: number
  titulo: string
  descripcion: string
  prioridad: Objeto
  estado: Objeto
  proyectoid: number
}

export default function Card({ tarea }: { tarea: Tarea }){
    return(
        <div className="flex justify-between items-center shadow-xl/30 h-16 rounded-md px-16">

            <h3 className="font-semibold">{tarea.titulo}</h3>
            <h4 className={`py-1 rounded-sm w-18 text-center
            ${
                tarea.prioridad.nombre === "Alta"
                    ? "text-red-700 bg-red-300"
                    : tarea.prioridad.nombre === "Media"
                    ? "text-orange-800 bg-orange-200"
                    : "text-yellow-800 bg-yellow-200"
            }
            `}>{tarea.prioridad.nombre}</h4>
            <h4 className="bg-secondary/75 min-w-25 text-center py-1 px-2 rounded-sm text-white">{tarea.estado.nombre}</h4>
        </div>
    )
}