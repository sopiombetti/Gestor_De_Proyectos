import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Admin from "@/pages/admin";
import {
  ApiGetProyecto,
  ApiCrearProyecto,
  ApiCrearTareasBulk,
} from "@/utils/api";
import { parsearArchivoTareas } from "@/utils/parsearArchivo";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
  ApiGetProyecto: jest.fn(),
  ApiCrearProyecto: jest.fn(),
  ApiCrearTareasBulk: jest.fn(),
  ApiGetTareasProyecto: jest.fn(),
}));

jest.mock("@/utils/parsearArchivo", () => ({
  parsearArchivoTareas: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("@/components/CardProyecto", () => ({
  __esModule: true,
  default: ({ proyecto }: any) => <div>{proyecto.titulo}</div>,
}));

jest.mock("@/components/Error", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <div>{text}</div>,
}));

describe("Admin", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUserContext as jest.Mock).mockReturnValue({
      user: { id: 1 },
      token: "token123",
    });

    (ApiGetProyecto as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  async function renderAdmin() {
    render(<Admin />);

    await waitFor(() => {
      expect(ApiGetProyecto).toHaveBeenCalled();
    });
  }

  it("renderiza correctamente", async () => {
    await renderAdmin();

    expect(
      screen.getByRole("heading", {
        name: /panel administración/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /crear proyecto/i,
      })
    ).toBeInTheDocument();
  });

  it("obtiene los proyectos", async () => {
    (ApiGetProyecto as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          titulo: "Proyecto Test",
        },
      ],
    });

    render(<Admin />);

    expect(
      await screen.findByText("Proyecto Test")
    ).toBeInTheDocument();
  });

  it("muestra el formulario", async () => {
    await renderAdmin();

    fireEvent.click(
      screen.getByRole("button", {
        name: /crear proyecto/i,
      })
    );

    expect(screen.getByPlaceholderText("Título")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument();
  });

  it("crea un proyecto", async () => {
    (ApiCrearProyecto as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 10,
        titulo: "Nuevo Proyecto",
      }),
    });

    await renderAdmin();

    fireEvent.click(
      screen.getByRole("button", {
        name: /crear proyecto/i,
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Título"), {
      target: { value: "Nuevo Proyecto" },
    });

    fireEvent.change(screen.getByPlaceholderText("Descripción"), {
      target: { value: "Descripción" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(ApiCrearProyecto).toHaveBeenCalled();
    });

    expect(
      await screen.findByText("Nuevo Proyecto")
    ).toBeInTheDocument();
  });

  it("muestra error si falla obtener proyectos", async () => {
    (ApiGetProyecto as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<Admin />);

    expect(
      await screen.findByText("No se pudieron obtener los proyectos.")
    ).toBeInTheDocument();
  });

  it("crea proyecto con archivo", async () => {
    (ApiCrearProyecto as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 15,
        titulo: "Proyecto Excel",
      }),
    });

    (parsearArchivoTareas as jest.Mock).mockResolvedValue([
      {
        titulo: "Tarea 1",
      },
    ]);

    (ApiCrearTareasBulk as jest.Mock).mockResolvedValue({
      ok: true,
    });

    await renderAdmin();

    fireEvent.click(
      screen.getByRole("button", {
        name: /crear proyecto/i,
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Título"), {
      target: { value: "Proyecto Excel" },
    });

    fireEvent.change(screen.getByPlaceholderText("Descripción"), {
      target: { value: "Descripción" },
    });

    const file = new File(["hola"], "archivo.csv", {
  type: "text/csv",
});

const input = document.querySelector(
  'input[type="file"]'
) as HTMLInputElement;

fireEvent.change(input, {
  target: {
    files: [file],
  },
});

    fireEvent.submit(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(parsearArchivoTareas).toHaveBeenCalledWith(file);
      expect(ApiCrearTareasBulk).toHaveBeenCalled();
    });
  });
});