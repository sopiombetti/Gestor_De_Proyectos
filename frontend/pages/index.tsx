import Link from "next/link";

export default function Login() {

  return (
    <section className="bg-gray-50 dark:bg-gray-900 pt-10">
      <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h4 className="mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Inicia sesión en tu cuenta
            </h4>
              <form className="space-y-6" action="#" method="#">
                <div>
                  <label htmlFor="email" className="block font-medium leading-6 text-gray-900">
                    Correo electrónico
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block font-medium leading-6 text-gray-900">
                      Contraseña
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-400 focus:outline-blue-400 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-full bg-cyan-700 px-3 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Ingresar
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  ¿No tienes una cuenta? 
                  <Link href="/register" className="px-2 font-medium text-gray-600 hover:underline dark:text-gray-500">
                    Regístrate
                  </Link>
                </p>
              </form>
          </div>
        </div>
      </div>
    </section>
  )
}