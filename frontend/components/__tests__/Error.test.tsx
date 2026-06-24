import { render, screen, fireEvent } from "@testing-library/react";
import MensajeError from "../ui/Error";

describe("MensajeError", () => {
  test("renderiza el mensaje recibido por props", () => {
    render(<MensajeError text="Ocurrió un error" />);

    expect(
      screen.getByText("Ocurrió un error")
    ).toBeInTheDocument();
  });

  test("renderiza el boton para cerrar el mensaje", () => {
    render(<MensajeError text="Ocurrió un error" />);

    expect(
      screen.getByRole("button")
    ).toBeInTheDocument();
  });

  test("oculta el mensaje al hacer click en cerrar", () => {
    render(<MensajeError text="Ocurrió un error" />);

    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.queryByText("Ocurrió un error")
    ).not.toBeInTheDocument();
  });
});