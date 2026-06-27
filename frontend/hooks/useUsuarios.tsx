import { ApiGetUsuarios } from "@/utils/api";
import { useEffect, useState } from "react";

type Usuario = {
    id: number
    nombre: string
    apellido: string
    email: string
    rol_admin: boolean
}

export function useUsuarios(token?: string | null) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        if (!token) return;
        async function getUsuarios() {
            try {
                const response = await ApiGetUsuarios(token ?? null);
                if (!response.ok) {
                    throw new Error("No se pudieron obtener los usuarios.");
                }
                const data = await response.json();
                setUsuarios(data);
            }
            catch (err) {
                console.error(err);
            }
        }
        getUsuarios();
    }, [])

    return { usuarios, setUsuarios}
}