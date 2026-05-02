import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-gray-300 shadow-lg">
      
     <div className="relative w-40 h-20">
  <Image
    src="/logo.png"
    alt="logotipo"
    fill
    className="object-contain"
  />
</div>

  <nav className="flex items-center justify-between px-6 py-3 bg-gray-300 ">
        <ul className="flex gap-8 text-gray-700 font-semibold">
          <li className="cursor-pointer hover:text-blue-600 transition">Inicio
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition">Características
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition">Nosotros</li>
        </ul>
      </nav>

    </div>
  );
}