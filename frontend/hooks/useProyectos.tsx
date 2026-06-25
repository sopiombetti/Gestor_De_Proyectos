import { ApiGetProyecto } from "@/utils/api";
import { useEffect, useState } from "react";

type Proyecto = {
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: string;
    lider: {
        id: number
        nombre: string
        apellido: string
        email: string
        rol_admin: boolean
    };
};

export function useProyectos(userId?: number, token?: string | null) {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    useEffect(() => {
        if (!userId || !token) return;
        const fetchProyectos = async () => {
            try {
                const response = await ApiGetProyecto(userId, token);

                if (!response.ok) {
                    throw new Error("No se pudieron obtener los proyectos.")
                }

                const data = await response.json();
                setProyectos(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProyectos();
    }, [userId, token]);

    return { proyectos, setProyectos };
}