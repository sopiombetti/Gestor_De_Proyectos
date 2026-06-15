import Link from "next/link";

export default function index(){

  return(
    <div className="flex flex-col items-center">
    <div className="flex flex-col items-center mt-20 mb-20 bg-gray-100 w-1/2 p-6 rounded-2xl">
      <h1 className="font-bold text-3xl">Bienvenidos a</h1>
      <img src="/logo.png" alt="logo" className="w-100"/>
      <h2 className="text-xl mt-8">La aplicación que te permite gestionar tus proyectos de trabajo.</h2>
      <div className="flex flex-col items-center mt-20 text-md space-y-4">
        <p>¿Ya tenes cuenta?</p>
        <Link href="/login" className="bg-secondary px-3 py-1.5 leading-6 font-semibold text-gray-900 shadow-sm cursor-pointer rounded-lg hover:bg-blue-300">Iniciá sesión</Link>
        <Link href="/register" className="bg-secondary px-3 py-1.5 leading-6 font-semibold text-gray-900 shadow-sm cursor-pointer rounded-lg hover:bg-blue-300">Registrate</Link>
      </div>
    </div>
    </div>
  )
}