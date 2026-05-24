import {useState} from "react";
import Link from "next/link";


export default function UserRegister(){

    const [nombreCompleto, setNombreCompleto]=useState("");
    const [correo, setCorreo]=useState("")
    const [contrasenia, setContrasenia]=useState("")
    const[reContrasenia, setReContrasenia]=useState("")

    return(
        <>


        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

            <div className="flex flex-col items-center text-center mb-6 pl-22">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Crear cuenta
            </h1>
            <h2 className="text-sm text-gray-500 max-w-xs">
                Empezá a organizar tus proyectos y tareas de forma simple
            </h2>
            </div>

        <form className="flex flex-col gap-3 p-6 w-96">
            
            <div className="flex gap-22">
                <div className="w-1/2">
            <h2 className="whitespace-nowrap">Nombre Completo</h2>
            <input class="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="nombre"
            placeholder="👤 Nombre Completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            />
            </div>

            <div className="w-1/2">
            <h2 className="whitespace-nowrap">Correo Electrónico</h2>
            <input class="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="correo"
            placeholder="📧 Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            />
            </div>
            </div>

            <div className="flex gap-22">
            <div className="w-1/2">
            <h2>Contraseña</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="contrasenia"
            placeholder="🔒 Contraseña"
            value={contrasenia}
            onChange={(e)=> setContrasenia(e.target.value)}
            />
             </div>
            
            <div className="w-1/2">
            <h2 className="whitespace-nowrap">Confirme contraseña</h2>
            <input class="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="reContrasenia"
            placeholder="🔒 Repetir contraseña"
            value={reContrasenia}
            onChange={(e)=> setReContrasenia(e.target.value)}
            />
           
            </div>
            </div>
            <div className="flex justify-center pl-22">
            <button className="text-white bg-blue-800 cursor-pointer hover:bg-blue-600 whitespace-nowrap rounded-md px-22 py-2 mt-6">
                Crear cuenta
            </button>
            </div>

            <p className="mt-3 text-center pl-22">
            ¿Ya tenés cuenta?
            <Link href="/login" className="text-blue-500 ml-1">
                Iniciá sesión
            </Link>
            </p>
            </form>
        </div>
  
        </>

    );

}