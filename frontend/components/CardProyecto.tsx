import { ApiGetReporte } from "@/utils/api"
import { useUserContext } from "@/utils/userContext"

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

  const { token } = useUserContext();

  const handleDownload = async () => {
      try{
        const response = await ApiGetReporte(proyecto.id, token);

        if (!response.ok) {
            throw new Error("No se puede obtener el reporte");
        }

        const blob = await response.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `informe.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
      catch(error){
        console.error(error);
      }
      
    };

    return (
        <div className="flex flex-col space-y-3 border border-2 rounded-xl border-secondary p-6">
            <h2 className="text-xl font-semibold">{proyecto.titulo}</h2>
            <p>{proyecto.descripcion}</p>
            <p>Creado el: {proyecto.fechaCreacion}</p>
            <button onClick={handleDownload} className="flex mt-10 justify-center w-[200px] rounded-full bg-primary px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm hover:bg-violet-400">Generar Informe</button>
        </div>
    )
}


