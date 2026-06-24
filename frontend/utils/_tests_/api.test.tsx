import {
  ApiRegister,
  ApiLogin,
  ApiGetTareas,
  ApiGetProyecto,
  ApiCrearProyecto,
  ApiGetUsuarios,
  ApiEditarTarea,
  ApiGetTareaPorId,
  ApiEditarTareaAdmin,
} from "../api";

describe("API", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ApiRegister hace POST a /usuarios", async () => {
    await ApiRegister(
      "Juan",
      "Perez",
      "juan@test.com",
      "1234"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/usuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: "Juan",
          apellido: "Perez",
          email: "juan@test.com",
          password: "1234",
        }),
      }
    );
  });

  test("ApiLogin hace POST a /usuarios/login", async () => {
    await ApiLogin(
      "juan@test.com",
      "1234"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/usuarios/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "juan@test.com",
          password: "1234",
        }),
      }
    );
  });

  test("ApiGetTareas arma la url correctamente", async () => {
    await ApiGetTareas(
      1,
      "3",
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tareas?idUsuario=1&idPrioridad=3",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
      }
    );
  });

  test("ApiGetProyecto hace GET a proyectos", async () => {
    await ApiGetProyecto(
      1,
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/proyectos?idUsuario=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
      }
    );
  });

  test("ApiCrearProyecto hace POST", async () => {
    const payload = {
      titulo: "Proyecto Test",
      descripcion: "Descripción",
      idLider: 1,
    };

    await ApiCrearProyecto(
      payload,
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/proyectos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify(payload),
      }
    );
  });

  test("ApiGetUsuarios hace GET", async () => {
    await ApiGetUsuarios("token123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/usuarios",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
      }
    );
  });

  test("ApiEditarTarea hace PATCH", async () => {
    await ApiEditarTarea(
      10,
      {
        idUsuario: 5,
      },
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tareas/10",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify({
          idUsuario: 5,
        }),
      }
    );
  });

  test("ApiGetTareaPorId hace GET", async () => {
    await ApiGetTareaPorId(
      20,
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tareas/20",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
      }
    );
  });

  test("ApiEditarTareaAdmin hace PATCH", async () => {
    await ApiEditarTareaAdmin(
      1,
      {
        titulo: "Nuevo título",
        descripcion: "Nueva descripción",
      },
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/tareas/1",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify({
          titulo: "Nuevo título",
          descripcion: "Nueva descripción",
        }),
      }
    );
  });
});