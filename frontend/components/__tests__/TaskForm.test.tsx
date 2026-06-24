import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "../tareas/TaskForm";

jest.mock("@/components/ui/Input", () => ({
  __esModule: true,
  default: ({ title, value, onChange }: any) => (
    <input
      aria-label={title}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock("@/components/ui/Select", () => ({
  __esModule: true,
  default: ({ title, value, onChange, options }: any) => (
    <select
      aria-label={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/ui/Button", () => ({
  __esModule: true,
  default: ({ title }: any) => (
    <button>{title}</button>
  ),
}));

describe("TaskForm", () => {
  it("renderiza correctamente el formulario", () => {
    render(<TaskForm />);

    expect(
      screen.getByRole("heading", {
        name: /crear tarea/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Empezá a organizar tus proyectos y tareas/i
      )
    ).toBeInTheDocument();
  });

  it("renderiza todos los campos", () => {
    render(<TaskForm />);

    expect(screen.getByLabelText("Título de la tarea")).toBeInTheDocument();

    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();

    expect(screen.getByLabelText("Proyecto")).toBeInTheDocument();

    expect(screen.getByLabelText("Prioridad")).toBeInTheDocument();

    expect(screen.getByLabelText("Fecha límite")).toBeInTheDocument();

    expect(screen.getByLabelText("Asignado a")).toBeInTheDocument();
  });

  it("permite escribir en los inputs", () => {
    render(<TaskForm />);

    const titulo = screen.getByLabelText("Título de la tarea");

    fireEvent.change(titulo, {
      target: {
        value: "Nueva tarea",
      },
    });

    expect(titulo).toHaveValue("Nueva tarea");
  });

  it("permite seleccionar una prioridad", () => {
    render(<TaskForm />);

    const prioridad = screen.getByLabelText("Prioridad");

    fireEvent.change(prioridad, {
      target: {
        value: "2",
      },
    });

    expect(prioridad).toHaveValue("2");
  });

  it("renderiza el botón Crear tarea", () => {
    render(<TaskForm />);

    expect(
      screen.getByRole("button", {
        name: /crear tarea/i,
      })
    ).toBeInTheDocument();
  });
});