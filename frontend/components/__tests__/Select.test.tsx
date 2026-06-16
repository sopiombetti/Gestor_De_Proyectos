import { render, screen, fireEvent } from "@testing-library/react";
import Select from "../Select";

describe("Select", () => {
  const opciones = [
    { value: 1, label: "No asignada" },
    { value: 2, label: "Asignada" },
    { value: 3, label: "En progreso" },
  ];

  test("renderiza el título", () => {
    render(
      <Select
        title="Estado"
        options={opciones}
        value={1}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("Estado:")).toBeInTheDocument();
  });

  test("renderiza todas las opciones", () => {
    render(
      <Select
        title="Estado"
        options={opciones}
        value={1}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("No asignada")).toBeInTheDocument();
    expect(screen.getByText("Asignada")).toBeInTheDocument();
    expect(screen.getByText("En progreso")).toBeInTheDocument();
  });

  test("muestra el valor seleccionado", () => {
    render(
      <Select
        title="Estado"
        options={opciones}
        value={2}
        onChange={jest.fn()}
      />
    );

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("2");
  });

  test("llama a onChange cuando cambia la opción", () => {
    const handleChange = jest.fn();

    render(
      <Select
        title="Estado"
        options={opciones}
        value={1}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "3" },
    });

    expect(handleChange).toHaveBeenCalledWith("3");
  });

  test("renderiza la imagen del check", () => {
    render(
      <Select
        title="Estado"
        options={opciones}
        value={1}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByAltText("check")).toBeInTheDocument();
  });
});