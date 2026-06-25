import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalEditarTarea from "@/components/admin/ModalEditTarea";
import { ApiEditarTareaAdmin, ApiGetUsuarios } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
  ApiEditarTareaAdmin: jest.fn(),
  ApiGetUsuarios: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("../ui/Select", () => (props: any) => (
  <select
    data-testid="usuario-select"
    value={props.value}
    onChange={(e) => props.onChange(Number(e.target.value))}
  >
    {props.options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

describe("ModalEditarTarea", () => {
  const onClose = jest.fn();
  const onGuardado = jest.fn();
  const setError = jest.fn();
  const setSuccess = jest.fn();

  const tarea = {
    id: 1,
    titulo: "Tarea Test",
    descripcion: "Descripción Test",
    prioridad: { id: 2, nombre: "Media" },
    usuario: {
      id: 1,
      nombre: "Sofia",
      apellido: "Piombetti",
      email: "sofia@mail.com",
      rol_admin: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useUserContext as jest.Mock).mockReturnValue({
      token: "token-test",
    });

    (ApiGetUsuarios as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, nombre: "Juan", apellido: "Pérez" },
      ],
    });
  });

  test("renderiza los datos de la tarea", () => {
    render(
      <ModalEditarTarea
        tarea={tarea}
        onClose={onClose}
        onGuardado={onGuardado}
        setError={setError}
        setSuccess={setSuccess}
      />
    );

    expect(screen.getByDisplayValue("Tarea Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descripción Test")).toBeInTheDocument();
  });

  test("cierra el modal al hacer click en Cancelar", () => {
    render(
      <ModalEditarTarea
        tarea={tarea}
        onClose={onClose}
        onGuardado={onGuardado}
        setError={setError}
        setSuccess={setSuccess}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  test("obtiene usuarios al montar", async () => {
    render(
      <ModalEditarTarea
        tarea={tarea}
        onClose={onClose}
        onGuardado={onGuardado}
        setError={setError}
        setSuccess={setSuccess}
      />
    );

    await waitFor(() => {
      expect(ApiGetUsuarios).toHaveBeenCalledWith("token-test");
    });
  });

  test("guarda los cambios correctamente", async () => {
    (ApiEditarTareaAdmin as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(
      <ModalEditarTarea
        tarea={tarea}
        onClose={onClose}
        onGuardado={onGuardado}
        setError={setError}
        setSuccess={setSuccess}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Tarea Test"), {
      target: { value: "Nueva tarea" },
    });

    fireEvent.change(screen.getByDisplayValue("Descripción Test"), {
      target: { value: "Nueva desc" },
    });

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(ApiEditarTareaAdmin).toHaveBeenCalled();
    });

    expect(onGuardado).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test("maneja error en guardado", async () => {
    (ApiEditarTareaAdmin as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ModalEditarTarea
        tarea={tarea}
        onClose={onClose}
        onGuardado={onGuardado}
        setError={setError}
        setSuccess={setSuccess}
      />
    );

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(onGuardado).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});