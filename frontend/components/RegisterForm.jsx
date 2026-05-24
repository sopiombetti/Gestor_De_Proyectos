import {useState} from "react";
import Link from "next/link";
import Error from "./error";
import Success from "./success"


export default function UserRegister(){

    const [nombre, setNombre]=useState("");
    const [apellido, setApellido]=useState("");
    const [posicion, setPosicion]=useState("");
    const [correo, setCorreo]=useState("")
    const [contrasenia, setContrasenia]=useState("")
    const [reContrasenia, setReContrasenia]=useState("")
    const [error, setError]=useState("")
    const [success, setSuccess]=useState("");


            const handleSubmit = async (e) => {
    e.preventDefault();

            if (contrasenia !== reContrasenia) {
        setError("Las contraseñas no coinciden.");
        return;
        }

        setError("");
        setSuccess("");


  try {

      const response = await fetch("http://localhost:3001/usuarios", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
        nombre,
        apellido,
        email: correo,
        password: contrasenia,
        posicion_laboral: posicion
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess("El usuario fue creado exitosamente.");

  



          } catch (err) {

      setError("El usuario no se ha registrado correctamente.");

    }
  };

    return(
        <>
        {success && <Success text={success} />}

        
         {error && <Error text={error} />}


        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">



            <div className="flex flex-col items-center text-center mb-6 pl-22">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Crear cuenta
            </h1>
            <h2 className="text-sm text-gray-500 max-w-xs">
                Empezá a organizar tus proyectos y tareas de forma simple
            </h2>
            </div>

            

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6 w-96">

           
            
            <div className="flex gap-22">
                <div className="w-1/2">
            <h2 className="whitespace-nowrap">Nombre</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="👤 Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            />
            </div>

            <div className="w-1/2">
            <h2 className="whitespace-nowrap">Correo Electrónico</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="📧 ejemplo@email.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            />
            </div>
            </div>

                        <div className="flex gap-22">
                <div className="w-1/2">
            <h2 className="whitespace-nowrap">Apellido</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="👤 Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            />
            </div>

            <div className="w-1/2">
            <h2 className="whitespace-nowrap">Posición laboral</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="<> Developer"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            />
            </div>
            </div>

            <div className="flex gap-22">
            <div className="w-1/2">
            <h2>Contraseña</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="🔒 ******"
            value={contrasenia}
            onChange={(e)=> setContrasenia(e.target.value)}
            />
             </div>
            
            <div className="w-1/2">
            <h2 className="whitespace-nowrap">Confirme contraseña</h2>
            <input className="border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="🔒 ******"
            value={reContrasenia}
            onChange={(e)=> setReContrasenia(e.target.value)}
            />
           
            </div>
            </div>
            <div className="flex justify-center pl-22">
            <button className="text-white bg-blue-800 cursor-pointer hover:bg-blue-600 whitespace-nowrap rounded-md px-22 py-2 mt-6"
            type="submit">
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