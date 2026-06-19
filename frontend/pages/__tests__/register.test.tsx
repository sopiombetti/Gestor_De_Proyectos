import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../register";
import { ApiRegister } from "@/utils/api";

jest.mock("@/utils/api", () => ({
  ApiRegister: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

jest.mock("../../components/Error", () => {
  return ({ text }: { text: string }) => <div>{text}</div>;
});

jest.mock("../../components/success", () => {
  return ({ text }: { text: string }) => <div>{text}</div>;
});

describe("Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el formulario", () => {
    render(<Register />);

    expect(screen.getAllByText("Crear cuenta")).toHaveLength(2);
    expect(screen.getByPlaceholderText("👤 Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("👤 Apellido")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("📧 ejemplo@email.com")
    ).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("🔒 ******")).toHaveLength(2);
  });

  it("muestra error cuando las contraseñas no coinciden", async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("👤 Nombre"), {
      target: { value: "Juan" },
    });

    fireEvent.change(screen.getByPlaceholderText("👤 Apellido"), {
      target: { value: "Perez" },
    });

    fireEvent.change(screen.getByPlaceholderText("📧 ejemplo@email.com"), {
      target: { value: "juan@test.com" },
    });

    const passwords = screen.getAllByPlaceholderText("🔒 ******");

    fireEvent.change(passwords[0], {
      target: { value: "123456" },
    });

    fireEvent.change(passwords[1], {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText("Las contraseñas no coinciden.")
    ).toBeInTheDocument();

    expect(ApiRegister).not.toHaveBeenCalled();
  });

  it("muestra mensaje de éxito cuando el registro es correcto", async () => {
    (ApiRegister as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "ok",
      }),
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("👤 Nombre"), {
      target: { value: "Juan" },
    });

    fireEvent.change(screen.getByPlaceholderText("👤 Apellido"), {
      target: { value: "Perez" },
    });

    fireEvent.change(screen.getByPlaceholderText("📧 ejemplo@email.com"), {
      target: { value: "juan@test.com" },
    });

    const passwords = screen.getAllByPlaceholderText("🔒 ******");

    fireEvent.change(passwords[0], {
      target: { value: "123456" },
    });

    fireEvent.change(passwords[1], {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(ApiRegister).toHaveBeenCalledWith(
        "Juan",
        "Perez",
        "juan@test.com",
        "123456"
      );
    });

    expect(
      await screen.findByText("El usuario fue creado exitosamente.")
    ).toBeInTheDocument();
  });

  it("muestra el mensaje de error devuelto por la API", async () => {
    (ApiRegister as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "El correo ya existe",
      }),
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("👤 Nombre"), {
      target: { value: "Juan" },
    });

    fireEvent.change(screen.getByPlaceholderText("👤 Apellido"), {
      target: { value: "Perez" },
    });

    fireEvent.change(screen.getByPlaceholderText("📧 ejemplo@email.com"), {
      target: { value: "juan@test.com" },
    });

    const passwords = screen.getAllByPlaceholderText("🔒 ******");

    fireEvent.change(passwords[0], {
      target: { value: "123456" },
    });

    fireEvent.change(passwords[1], {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText("El correo ya existe")
    ).toBeInTheDocument();
  });

  it("muestra un error genérico si la API lanza una excepción", async () => {
    (ApiRegister as jest.Mock).mockRejectedValue(new Error("Error"));

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("👤 Nombre"), {
      target: { value: "Juan" },
    });

    fireEvent.change(screen.getByPlaceholderText("👤 Apellido"), {
      target: { value: "Perez" },
    });

    fireEvent.change(screen.getByPlaceholderText("📧 ejemplo@email.com"), {
      target: { value: "juan@test.com" },
    });

    const passwords = screen.getAllByPlaceholderText("🔒 ******");

    fireEvent.change(passwords[0], {
      target: { value: "123456" },
    });

    fireEvent.change(passwords[1], {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText(
        "El usuario no se ha registrado correctamente."
      )
    ).toBeInTheDocument();
  });
});