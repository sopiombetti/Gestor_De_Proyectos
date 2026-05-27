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

export async function ApiGetTareas(){
    return fetch("http://localhost:3000/tareas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    });
}