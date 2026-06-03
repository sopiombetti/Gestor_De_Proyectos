"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/utils/userContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserContext();
  const router = useRouter();

  function handleLogout(){
    logout();
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-gray-300 shadow-lg">
      <div className="relative w-40 h-20">
        <Image
          src="/logo.png"
          alt="Logotipo"
          fill
          className="object-contain"
        />
      </div>
      {user ? 
      <nav className="relative">
        <button onClick={() => setOpen(!open)} className="relative w-10 h-10">
          <Image
            src="/account_circle.svg"
            alt="Usuario"
            fill
            className="object-contain"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg border z-50">
            {user.isAdmin ? 
            <Link href="/admin" className="block px-4 py-3 hover:bg-gray-100">
              Panel Administrador
            </Link> : <></>}
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-100">
              Cerrar Sesión
            </button>
          </div>
        )}
      </nav> : <></>}
    </div>
  );
}