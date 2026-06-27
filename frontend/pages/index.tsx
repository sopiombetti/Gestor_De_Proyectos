import Link from "next/link";

export default function index() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden px-4">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
      <div className="flex flex-col items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-slate-700 rounded-3xl px-6 md:px-12 py-10 md:py-14 max-w-2xl w-full z-10">
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-4 mb-8">
          <img src="/logo.png" alt="logo" className="w-28 md:w-40" />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-gray-800 dark:text-white text-center">
          Gestioná tus proyectos
        </h1>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-300 text-center mt-4 max-w-xl">
          Organizá tareas y equipos de forma simple y eficiente.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 text-sm text-gray-500 dark:text-gray-300 text-center">
          <span>✔ Proyectos</span>
          <span>✔ Tareas</span>
          <span>✔ Reportes</span>
        </div>
        <div className="flex flex-col w-full mt-12 gap-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-500 hover:scale-105 transition-all shadow-lg"
          >
            Iniciá sesión
          </Link>
          <Link
            href="/register"
            className="w-full border border-gray-300 dark:border-slate-700 py-3 rounded-xl font-semibold text-center text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Registrate
          </Link>
        </div>

      </div>
    </div>
  )
}