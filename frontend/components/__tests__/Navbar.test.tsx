import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../navbar";
import { useUserContext } from "@/utils/userContext";
import { useRouter } from "next/router";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => (
    <img
      src={props.src}
      alt={props.alt}
    />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: any) => (
    <a href={href}>
      {children}
    </a>
  ),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

describe("Navbar", () => {
  const pushMock = jest.fn();
  const logoutMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renderiza el logo", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: null,
      logout: logoutMock,
    });

    render(<Navbar />);

    expect(screen.getByAltText("Logotipo")).toBeInTheDocument();
  });

  it("no muestra menú si no hay usuario", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: null,
      logout: logoutMock,
    });

    render(<Navbar />);

    expect(screen.queryByAltText("Usuario")).not.toBeInTheDocument();
  });

  it("muestra el botón de usuario si existe usuario", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Juan",
        isAdmin: false,
      },
      logout: logoutMock,
    });

    render(<Navbar />);

    expect(screen.getByAltText("Usuario")).toBeInTheDocument();
  });

  it("abre el menú al hacer click", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Juan",
        isAdmin: false,
      },
      logout: logoutMock,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByAltText("Usuario"));

    expect(screen.getByText("Inicio")).toBeInTheDocument();

    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  it("muestra Panel Administrador si el usuario es admin", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Admin",
        isAdmin: true,
      },
      logout: logoutMock,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByAltText("Usuario"));

    expect(screen.getByText("Panel Administrador")).toBeInTheDocument();
  });

  it("no muestra Panel Administrador si no es admin", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Juan",
        isAdmin: false,
      },
      logout: logoutMock,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByAltText("Usuario"));

    expect(screen.queryByText("Panel Administrador")).not.toBeInTheDocument();
  });

  it("ejecuta logout y redirecciona al login", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        nombre: "Juan",
        isAdmin: false,
      },
      logout: logoutMock,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByAltText("Usuario"));

    fireEvent.click(screen.getByText("Cerrar Sesión"));

    expect(logoutMock).toHaveBeenCalled();

    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});