import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../ui/Button";

describe("Button", () => {
  test("renderiza el título recibido por props", () => {
    render(<Button title="Guardar" />);

    expect(screen.getByRole("button")).toHaveTextContent("Guardar");
  });

  test("hace onClick al hacer click", () => {
    const handleClick = jest.fn();

    render(
      <Button
        title="Guardar"
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("tipo correcto", () => {
    render(
      <Button
        title="Enviar"
        type="submit"
      />
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "type",
      "submit"
    );
  });

  test("no se puede usar cuando disabled es true", () => {
    render(
      <Button
        title="Guardar"
        disabled={true}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("no ejecuta onClick cuando está deshabilitado", () => {
    const handleClick = jest.fn();

    render(
      <Button
        title="Guardar"
        onClick={handleClick}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });
});