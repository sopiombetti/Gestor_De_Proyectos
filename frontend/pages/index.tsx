import Link from "next/link";

export default function index(){

  return(
    <div className="flex flex-col items-center mt-20 mb-20">
      <h1 className="font-bold text-2xl">Bienvenidos a Taskflow</h1>
      <h2 className="text-xl mt-10">La aplicación que te permite gestionar tus proyectos de trabajo.</h2>
      <div className="flex flex-col items-center mt-20 text-xl space-y-3">
        <p>¿Ya tenes cuenta?</p>
        <Link href="/login" className="hover:text-blue-800">Iniciá sesión</Link>
        <Link href="/register" className="hover:text-blue-800">Registrate</Link>
      </div>
    </div>
  )
}