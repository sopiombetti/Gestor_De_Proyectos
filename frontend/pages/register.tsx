import { useState, type FormEvent } from "react";
import Link from "next/link";
import MensajeError from "../components/ui/Error";
import Success from "../components/ui/Success";
import { ApiRegister } from "@/utils/api";
import { useRouter } from "next/router";

export default function Register() {

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [reContrasenia, setReContrasenia] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("El mail debe tener un formato válido.");
            return;
        }
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (!passwordRegex.test(contrasenia)) {
            setError("La contraseña debe contener al menos 8 caracteres y al menos 1 número.");
            return;
        }
        if (contrasenia !== reContrasenia) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setError("");
        setSuccess("");

        try {
            const response = await ApiRegister(nombre, apellido, email, contrasenia, isAdmin);
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return;
            }
            setSuccess("El usuario fue creado exitosamente.");
            router.push("/login");

        } catch (err) {
            setError("El usuario no se ha registrado correctamente.");
        }
    };

    return (
        <>
            {success && <Success text={success} />}
            {error && <MensajeError text={error} />}

            <section className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-10">
                <div className="flex flex-col items-center px-4 sm:px-6 mx-auto pb-10 lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-5 sm:p-8 space-y-4 md:space-y-6">

                            <div className="flex flex-col items-center text-center space-y-1">
                                <h1 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                                    Crear cuenta
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Empezá a organizar tus proyectos y tareas de forma simple
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                            Nombre
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                type="text"
                                                placeholder="👤 Nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                            Apellido
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                type="text"
                                                placeholder="👤 Apellido"
                                                value={apellido}
                                                onChange={(e) => setApellido(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                        Correo Electrónico
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                            type="email"
                                            placeholder="📧 ejemplo@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                            Contraseña
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                type="password"
                                                placeholder="🔒 ******"
                                                value={contrasenia}
                                                onChange={(e) => setContrasenia(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                            Confirmar contraseña
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                type="password"
                                                placeholder="🔒 ******"
                                                value={reContrasenia}
                                                onChange={(e) => setReContrasenia(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-2">
                                    <label className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                                        Rol
                                    </label>
                                    <div className="flex flex-col sm:flex-row justify-around border-0 shadow-sm ring-1 ring-inset p-3 ring-blue-400 dark:ring-blue-500 rounded-md gap-3 sm:gap-0">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="lider"
                                                name="rol"
                                                className="accent-blue-500"
                                                checked={isAdmin === true}
                                                onChange={() => setIsAdmin(true)}
                                            />
                                            <label htmlFor="lider" className="text-gray-800 dark:text-gray-200 cursor-pointer">
                                                Soy líder
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="colaborador"
                                                name="rol"
                                                className="accent-blue-500"
                                                checked={isAdmin === false}
                                                onChange={() => setIsAdmin(false)}
                                            />
                                            <label htmlFor="colaborador" className="text-gray-800 dark:text-gray-200 cursor-pointer">
                                                Soy colaborador
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full mt-6 justify-center rounded-full bg-secondary px-3 py-2 font-semibold leading-6 text-gray-900 dark:text-white shadow-sm cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                                >
                                    Crear cuenta
                                </button>

                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    ¿Ya tenés cuenta?{" "}
                                    <Link href="/login" className="font-medium text-gray-600 dark:text-gray-300 hover:underline">
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