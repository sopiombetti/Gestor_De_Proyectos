export function ApiLogin(email: string, password: string){
    return fetch("http://localhost:3000/usuarios/login", {
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

export async function ApiGetTareas(idUsuario: number, idPrioridad: string){
    let url = `http://localhost:3000/tareas?idUsuario=${idUsuario}`;

    if (idPrioridad) {
      url += `&idPrioridad=${idPrioridad}`;
    }
    return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    });
}