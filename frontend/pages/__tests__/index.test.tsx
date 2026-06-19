import { render, screen } from "@testing-library/react";
import Index from "../index"; 

describe("Index Page", () => {
  it("renderiza el título principal", () => {
    render(<Index />);

    expect(screen.getByText("Bienvenidos a")).toBeInTheDocument();
  });

  it("renderiza la descripción", () => {
    render(<Index />);

    expect(
      screen.getByText(
        "La aplicación que te permite gestionar tus proyectos de trabajo."
      )
    ).toBeInTheDocument();
  });

  it("renderiza los links de login y registro", () => {
    render(<Index />);

    const loginLink = screen.getByRole("link", { name: /iniciá sesión/i });
    const registerLink = screen.getByRole("link", { name: /registrate/i });

    expect(loginLink).toHaveAttribute("href", "/login");
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("renderiza el logo", () => {
    render(<Index />);

    const img = screen.getByAltText("logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/logo.png");
  });
});