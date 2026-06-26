import { render, screen, fireEvent } from "@testing-library/react";
import Admin from "@/pages/admin";
import { useProyectos } from "@/hooks/useProyectos";

jest.mock("@/hooks/useProyectos", () => ({
  useProyectos: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: () => ({
    user: { id: 1 },
    token: "fake-token",
  }),
}));

const proyectosMock = [
  {
    id: 1,
    titulo: "Proyecto 1",
    descripcion: "Desc 1",
    fechaCreacion: "2024-01-01",
    lider: {
      id: 1,
      nombre: "Juan",
      apellido: "Perez",
      email: "test@test.com",
      rol_admin: true,
    },
  },
];

describe("Admin page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useProyectos as jest.Mock).mockReturnValue({
      proyectos: proyectosMock,
      setProyectos: jest.fn(),
    });
  });

  it("renderiza el título del panel", () => {
    render(<Admin />);
    expect(screen.getByText("Panel Administración")).toBeInTheDocument();
  });

  it("muestra los proyectos", () => {
    render(<Admin />);
    expect(screen.getByText("Proyecto 1")).toBeInTheDocument();
  });

  it("abre el formulario al hacer click en crear proyecto", () => {
    render(<Admin />);

    const button = screen.getByText("+ Crear Proyecto");
    fireEvent.click(button);

    expect(screen.getByText(/crear proyecto/i)).toBeInTheDocument();
  });
});