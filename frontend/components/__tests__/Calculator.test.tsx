import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "../Calculator";

describe("Calculator", () => {
  test("renderiza correctamente los inputs y el botón", () => {
    const devolverResultado = jest.fn();

    render(<Calculator devolverResultado={devolverResultado} />);

    expect(
      screen.getByText("Calcular estimación de horas (PERT):")
    ).toBeInTheDocument();

    expect(screen.getByText("Optimista")).toBeInTheDocument();
    expect(screen.getByText("Más probable")).toBeInTheDocument();
    expect(screen.getByText("Pesimista")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Calcular" })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
  });

  test("calcula la estimación PERT y muestra el resultado", () => {
    const devolverResultado = jest.fn();

    render(<Calculator devolverResultado={devolverResultado} />);

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.change(inputs[0], {
      target: { value: "2" },
    });

    fireEvent.change(inputs[1], {
      target: { value: "4" },
    });

    fireEvent.change(inputs[2], {
      target: { value: "8" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Calcular" })
    );

    expect(
      screen.getByText("Estimación PERT: 4.33 horas")
    ).toBeInTheDocument();

    expect(devolverResultado).toHaveBeenCalledWith(4);
  });

  test("calcula correctamente cuando todos los valores son iguales", () => {
    const devolverResultado = jest.fn();

    render(<Calculator devolverResultado={devolverResultado} />);

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.change(inputs[0], {
      target: { value: "6" },
    });

    fireEvent.change(inputs[1], {
      target: { value: "6" },
    });

    fireEvent.change(inputs[2], {
      target: { value: "6" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Calcular" })
    );

    expect(
      screen.getByText("Estimación PERT: 6.00 horas")
    ).toBeInTheDocument();

    expect(devolverResultado).toHaveBeenCalledWith(6);
  });
});