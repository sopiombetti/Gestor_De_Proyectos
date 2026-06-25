import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../ui/Input";

describe("Input", () => {
  test("renderiza el título recibido por props", () => {
    render(
      <Input
        title="Nombre"
        type="text"
      />
    );

    expect(
      screen.getByText("Nombre")
    ).toBeInTheDocument();
  });

  test("renderiza un input con el tipo", () => {
    render(
      <Input
        title="Edad"
        type="number"
      />
    );

    const input = screen.getByRole("spinbutton");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  test("muestra el valor recibido por props", () => {
    render(
      <Input
        title="Nombre"
        type="text"
        value="Juan"
      />
    );

    expect(
      screen.getByDisplayValue("Juan")
    ).toBeInTheDocument();
  });

  test("ejecuta onChange cuando cambia el valor", () => {
    const handleChange = jest.fn();

    render(
      <Input
        title="Nombre"
        type="text"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Pedro" },
    });

    expect(handleChange).toHaveBeenCalled();
  });
});