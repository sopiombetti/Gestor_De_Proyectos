import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiLogin } from "../utils/api"
import { useRouter } from "next/router";
import { useUserContext } from "@/utils/userContext";
import MensajeError from "../components/ui/Error";

export default function Login() {

  const { login } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await ApiLogin(email, password);

      if (!response.ok) {
        setError("Credenciales incorrectas");
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      login(
        {
          id: data.id,
          nombre: data.nombre,
          isAdmin: data.isAdmin,
        },
        data.token
      );

      console.log("Login exitoso");

      router.push("/home");

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      {error && <MensajeError text={error} />}

      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-10">
        <div className="flex flex-col items-center px-4 sm:px-6 mx-auto pb-10 lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5 sm:p-8 space-y-4 md:space-y-6">

              <h4 className="mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                Iniciá sesión en tu cuenta
              </h4>

              <form className="space-y-6" action="#" method="#" onSubmit={handleLogin}>

                <div>
                  <label htmlFor="email" className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                    Correo electrónico
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="📧 ejemplo@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="🔒 Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-blue-400 dark:ring-blue-500 focus:outline-blue-400 dark:focus:outline-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-full bg-secondary px-3 py-2 font-semibold leading-6 text-gray-900 dark:text-white shadow-sm cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                >
                  Ingresar
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  ¿No tenés una cuenta?{" "}
                  <Link href="/register" className="font-medium text-gray-600 dark:text-gray-300 hover:underline">
                    Regístrate
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