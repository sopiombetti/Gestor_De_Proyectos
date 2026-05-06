type Tarea = {
  id: number
  titulo: string
  descripcion: string
  prioridad: string
  estado: string
  proyectoid: number
}

export default function Card({ tarea }: { tarea: Tarea }){
    return(
        <div className="flex justify-between items-center shadow-xl/30 h-16 rounded-md px-16">
            <h4>Proyecto #{tarea.proyectoid}</h4>
            <h3 className="font-semibold">{tarea.titulo}</h3>
            <h4 className="text-red-600 bg-red-300 py-1 rounded-sm w-18 text-center">{tarea.prioridad}</h4>
            <h4 className="bg-secondary/75 py-1 px-2 rounded-sm text-white">{tarea.estado}</h4>
        </div>
    )
}