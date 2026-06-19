import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "@/pages/home";
import { ApiGetTareas } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
  ApiGetTareas: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("@/components/Card", () => ({
  __esModule: true,
  default: ({ tarea }: any) => <div>{tarea.titulo}</div>,
}));

jest.mock("@/components/BoxTareas", () => ({
  __esModule: true,
  default: ({ nombre, cantidad }: any) => (
    <div>
      {nombre}: {cantidad}
    </div>
  ),
}));

jest.mock("@/components/Error", () => ({
  __esModule: true,
  default: ({ text }: any) => <div>{text}</div>,
}));

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Juan",
      },
      token: "token123",
    });
  });

  it("renderiza correctamente", async () => {
    (ApiGetTareas as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Home />);

    await waitFor(() => {
      expect(ApiGetTareas).toHaveBeenCalled();
    });

    expect(
      screen.getByText("Hola, Juan")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Filtrar Tareas")
    ).toBeInTheDocument();
  });

  it("obtiene las tareas al montar", async () => {
    (ApiGetTareas as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          titulo: "Tarea 1",
          estado: {
            nombre: "Asignada",
          },
        },
      ],
    });

    render(<Home />);

    expect(
      await screen.findByText("Tarea 1")
    ).toBeInTheDocument();

    expect(ApiGetTareas).toHaveBeenCalledWith(
      1,
      "",
      "token123"
    );
  });

  it("muestra las cantidades por estado", async () => {
    (ApiGetTareas as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          titulo: "A",
          estado: {
            nombre: "Asignada",
          },
        },
        {
          id: 2,
          titulo: "B",
          estado: {
            nombre: "En progreso",
          },
        },
        {
          id: 3,
          titulo: "C",
          estado: {
            nombre: "Finalizada",
          },
        },
      ],
    });

    render(<Home />);

    expect(
      await screen.findByText("Asignadas: 1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("En Progreso: 1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Finalizadas: 1")
    ).toBeInTheDocument();
  });

  it("filtra por prioridad", async () => {
    (ApiGetTareas as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Home />);

    await waitFor(() => {
      expect(ApiGetTareas).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "2",
      },
    });

    await waitFor(() => {
      expect(ApiGetTareas).toHaveBeenLastCalledWith(
        1,
        "2",
        "token123"
      );
    });
  });

  it("muestra error si falla la api", async () => {
    (ApiGetTareas as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<Home />);

    expect(
      await screen.findByText(
        "No se pudieron obtener las tareas."
      )
    ).toBeInTheDocument();
  });
});