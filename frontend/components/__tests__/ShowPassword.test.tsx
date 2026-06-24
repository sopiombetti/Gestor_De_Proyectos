import { render, screen, fireEvent } from "@testing-library/react";
import PasswordInput from "../ShowPassword";

describe("PasswordInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el input con el placeholder recibido", () => {
    render(
      <PasswordInput
        value=""
        onChange={mockOnChange}
        placeholder="Ingrese contraseña"
      />
    );

    expect(
      screen.getByPlaceholderText("Ingrese contraseña")
    ).toBeInTheDocument();
  });

  it("renderiza inicialmente como password", () => {
    render(
      <PasswordInput
        value="123456"
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    const input = screen.getByPlaceholderText("Contraseña");

    expect(input).toHaveAttribute("type", "password");
  });

  it("muestra el valor recibido por props", () => {
    render(
      <PasswordInput
        value="miPassword"
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    const input = screen.getByPlaceholderText(
      "Contraseña"
    ) as HTMLInputElement;

    expect(input.value).toBe("miPassword");
  });

  it("ejecuta onChange al escribir", () => {
    render(
      <PasswordInput
        value=""
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    const input = screen.getByPlaceholderText("Contraseña");

    fireEvent.change(input, {
      target: { value: "123456" },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("muestra la contraseña al hacer click en el botón", () => {
    render(
      <PasswordInput
        value="123456"
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    const input = screen.getByPlaceholderText("Contraseña");
    const button = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(button);

    expect(input).toHaveAttribute("type", "text");
  });

  it("oculta nuevamente la contraseña al hacer doble click", () => {
    render(
      <PasswordInput
        value="123456"
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    const input = screen.getByPlaceholderText("Contraseña");
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(button);

    expect(input).toHaveAttribute("type", "password");
  });

  it("renderiza el ícono del ojo", () => {
    render(
      <PasswordInput
        value=""
        onChange={mockOnChange}
        placeholder="Contraseña"
      />
    );

    expect(
      screen.getByRole("button")
    ).toHaveTextContent("👁");
  });
});