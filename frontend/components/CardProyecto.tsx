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

export default function CardProyecto({ proyecto }: { proyecto: Proyecto }){

    return (
        <div className="flex flex-col space-y-3 border border-2 rounded-xl border-secondary p-6">
            <h2 className="text-xl font-semibold">{proyecto.titulo}</h2>
            <p>{proyecto.descripcion}</p>
            <p>Creado el: {proyecto.fechaCreacion}</p>
            <button className="flex mt-10 justify-center w-[200px] rounded-full bg-primary px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm hover:bg-violet-400">Generar Informe</button>
        </div>
    )
}


