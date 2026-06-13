import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskDetail from "./TaskDetail";
import { ApiEditarTarea } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
  ApiEditarTarea: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));


jest.mock("./Button", () => (props: any) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.title}
  </button>
));


jest.mock("./Select", () => (props: any) => (
  <select
    data-testid="estado-select"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  >
    {props.options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));


jest.mock("./Calculator", () => (props: any) => (
  <button
    data-testid="calculator"
    onClick={() => props.devolverResultado(12)}
  >
    Calcular
  </button>
));

describe("TaskDetail", () => {
  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      token: "token-test",
    });

    jest.clearAllMocks();
  });

  const props = {
    id: 1,
    title: "Mi tarea",
    description: "Descripción de prueba",
    estado: 2,
    prioridad: "Alta",
    estimacion: 5,
  };

  test("renderiza correctamente los datos", () => {
    render(<TaskDetail {...props} />);

    expect(screen.getByText("Mi tarea")).toBeInTheDocument();
    expect(screen.getByText("Descripción de prueba")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(
      screen.getByText("Estimación: 5 horas")
    ).toBeInTheDocument();
  });

  test("cambia el estado seleccionado", () => {
    render(<TaskDetail {...props} />);

    const select = screen.getByTestId("estado-select");

    fireEvent.change(select, {
      target: {
        value: "3",
      },
    });

    expect(select).toHaveValue("3");
  });

  test("guarda el estado", async () => {
    render(<TaskDetail {...props} />);

    fireEvent.click(screen.getByText("Guardar estado"));

    await waitFor(() => {
      expect(ApiEditarTarea).toHaveBeenCalledWith(
        1,
        {
          idEstado: 2,
        },
        "token-test"
      );
    });
  });

  test("guarda un nuevo estado seleccionado", async () => {
    render(<TaskDetail {...props} />);

    fireEvent.change(screen.getByTestId("estado-select"), {
      target: {
        value: "4",
      },
    });

    fireEvent.click(screen.getByText("Guardar estado"));

    await waitFor(() => {
      expect(ApiEditarTarea).toHaveBeenCalledWith(
        1,
        {
          idEstado: 4,
        },
        "token-test"
      );
    });
  });

  test("actualiza la estimación usando Calculator", () => {
    render(<TaskDetail {...props} />);

    fireEvent.click(screen.getByTestId("calculator"));

    expect(
      screen.getByText("Estimación: 12 horas")
    ).toBeInTheDocument();
  });

  test("guarda la estimación calculada", async () => {
    render(<TaskDetail {...props} />);

    fireEvent.click(screen.getByTestId("calculator"));
    fireEvent.click(screen.getByText("Guardar estimación"));

    await waitFor(() => {
      expect(ApiEditarTarea).toHaveBeenCalledWith(
        1,
        {
          estimacion: 12,
        },
        "token-test"
      );
    });
  });

  test("deshabilita los botones cuando la tarea está finalizada", () => {
    render(
      <TaskDetail
        {...props}
        estado={4}
      />
    );

    expect(
      screen.getByText("Guardar estado")
    ).toBeDisabled();

    expect(
      screen.getByText("Guardar estimación")
    ).toBeDisabled();
  });

  test("no llama a la API si no existe token", async () => {
    (useUserContext as jest.Mock).mockReturnValue({
      token: null,
    });

    render(<TaskDetail {...props} />);

    fireEvent.click(screen.getByText("Guardar estado"));

    await waitFor(() => {
      expect(ApiEditarTarea).not.toHaveBeenCalled();
    });
  });
});