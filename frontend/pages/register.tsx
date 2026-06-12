import { useState, type FormEvent  } from "react";
import Link from "next/link";
import MensajeError from "../components/Error";
import Success from "../components/success";
import { ApiRegister } from "@/utils/api";

export default function Register() {

  const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("")
    const [contrasenia, setContrasenia] = useState("")
    const [reContrasenia, setReContrasenia] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (contrasenia !== reContrasenia) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setError("");
        setSuccess("");

        try {
            const response = await ApiRegister(nombre, apellido, correo, contrasenia);
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
      {error && <MensajeError text={error} />}

      <section className="bg-gray-50 dark:bg-gray-900 pt-10">
        <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                <div className="flex flex-col items-center text-center space-y-1">
                <h1 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Crear cuenta
                </h1>
                <p className="text-sm text-gray-500">
                    Empezá a organizar tus proyectos y tareas de forma simple
                </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-1/2">
                    <label className="block font-medium leading-6 text-gray-900">Nombre</label>
                    <div className="mt-2">
                        <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="👤 Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    </div>
                    <div className="w-1/2">
                    <label className="block font-medium leading-6 text-gray-900">Apellido</label>
                    <div className="mt-2">
                        <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="👤 Apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                    <label className="block font-medium leading-6 text-gray-900">Correo Electrónico</label>
                    <div className="mt-2">
                        <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        type="email"
                        placeholder="📧 ejemplo@email.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                    <label className="block font-medium leading-6 text-gray-900">Contraseña</label>
                    <div className="mt-2">
                        <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        type="password"
                        placeholder="🔒 ******"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        />
                    </div>
                    </div>
                    <div className="w-1/2">
                    <label className="block font-medium leading-6 text-gray-900 whitespace-nowrap">Confirmar contraseña</label>
                    <div className="mt-2">
                        <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        type="password"
                        placeholder="🔒 ******"
                        value={reContrasenia}
                        onChange={(e) => setReContrasenia(e.target.value)}
                        />
                    </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="flex w-full mt-8 justify-center rounded-full bg-secondary px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm cursor-pointer hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Crear cuenta
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    ¿Ya tenés cuenta?
                    <Link href="/login" className="px-2 font-medium text-gray-600 hover:underline dark:text-gray-500">
                    Iniciá sesión
                    </Link>
                </p>
                </form>
            </div>
            </div>
        </div>
      </section>
    </>
  )
}