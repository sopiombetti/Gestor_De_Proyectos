import CardProyecto from "@/components/CardProyecto";
import { ApiGetProyecto } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";
import { useEffect, useState } from "react"

export default function Admin(){
    const [proyectos, setProyectos] = useState([]);
    const [show, setShow] = useState(false);
    const { user, token } = useUserContext();

    useEffect(() => {
        async function obtenerProyecto(){
              try {
                  const response = await ApiGetProyecto(user?.id, token);
              
                  if (!response.ok) {
                    throw new Error("No se puede obtener el proyecto");
                  }
              
                  const data = await response.json();
                  setProyectos(data);
              }
              catch (error) {
                console.error(error);
              }
            }
            obtenerProyecto();
    }, []);

    function handleCreate(){
        setShow(true);
    }

  return(
    <div className="flex flex-col m-20 space-y-10">
        <div className="flex flex-col space-y-6">
            <h1 className="font-bold text-2xl">Panel Administración</h1>
            <button className="flex justify-center w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleCreate}>Crear Proyecto</button>
        </div>
        {show ? <div className="flex bg-gray-200 rounded-2xl p-6">
            <form className="flex flex-col space-y-3">
                <label>Título:</label>
                <input className="bg-white rounded-md w-[500px] p-2" id="title" name="title" type="text" placeholder="Título"/>
                <label>Descripción:</label>
                <input className="bg-white rounded-md w-[500px] p-2" id="description" name="description" type="text" placeholder="Descripción"/>
                <label>Subir archivo (.xls / .csv)</label>
                <input className="bg-white rounded-md w-[500px] p-2" id="file" name="file" type="file"/>
            </form>
        </div> : <></>}
        {proyectos.map(proyecto => <CardProyecto proyecto={proyecto} key={proyecto.id}/>)}  
    </div>
  )
}