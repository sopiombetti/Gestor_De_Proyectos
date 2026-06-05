
const API_URL = "http://localhost:3000";

function authHeaders(token: string | null): Record<string, string> {
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

export function ApiLogin(email: string, password: string){
    return fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
    });
}

export async function ApiGetTareas(idUsuario: number, idPrioridad: string, token: string | null){
    let url = `${API_URL}/tareas?idUsuario=${idUsuario}`;

    if (idPrioridad) {
      url += `&idPrioridad=${idPrioridad}`;
    }
    return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        }
    });
}

export async function ApiGetProyecto(idUsuario: number, token: string | null){
  return fetch(`${API_URL}/proyectos?idUsuario=${idUsuario}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        }
    });
}

export async function ApiGetReporte(id: number, token: string | null){
  return fetch(`${API_URL}/reportes/proyectos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        }
    });
}