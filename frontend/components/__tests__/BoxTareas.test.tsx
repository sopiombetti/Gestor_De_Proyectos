import { render, screen } from "@testing-library/react";
import BoxTareas from "../tareas/BoxTareas";

describe("BoxTareas", () => {
  test("renderiza el nombre recibido por props", () => {
    render(
      <BoxTareas
        nombre="Pendientes"
        cantidad={5}
      />
    );

    expect(screen.getByText("Pendientes")).toBeInTheDocument();
  });

  test("renderiza la cantidad recibida por props", () => {
    render(
      <BoxTareas
        nombre="Pendientes"
        cantidad={5}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("renderiza la imagen del check", () => {
    render(
      <BoxTareas
        nombre="Pendientes"
        cantidad={5}
      />
    );

    const imagen = screen.getByAltText("check");

    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "/check.svg");
  });
});