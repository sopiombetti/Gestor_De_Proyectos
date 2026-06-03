import { ApiGetProyecto } from "@/utils/api";
import { useEffect, useState } from "react"

export default function admin(){
    const [proyecto, setProyecto] = useState({});
    const[show, setShow] = useState(false);

    useEffect(() => {
        async function obtenerProyecto(){
              try {
                  const response = await ApiGetProyecto();
              
                  if (!response.ok) {
                    throw new Error("No se puede obtener el proyecto");
                  }
              
                  const data = await response.json();
        
                  console.log(data);
                  setProyecto(data);
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
            <button className="flex justify-center w-[200px] rounded-full bg-secondary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleCreate}>Crear Proyecto</button>
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
        <div className="flex flex-col space-y-3 border border-2 rounded-xl border-secondary p-6">
            <h2 className="text-xl font-semibold">Proyecto {proyecto.titulo}</h2>
            <p>{proyecto.descripcion}</p>
            <p>Creado el: {proyecto.fechaCreacion}</p>
            <p>Colaboradores:</p>
        </div>
        <button className="flex justify-center w-[200px] rounded-full bg-primary px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm hover:bg-violet-400">Generar Informe</button>        
    </div>
  )
}