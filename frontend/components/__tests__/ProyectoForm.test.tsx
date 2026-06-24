import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { ApiCrearProyecto, ApiCrearTareasBulk, } from "@/utils/api";
import { parsearArchivoTareas } from "@/utils/parsearArchivo";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
    ApiCrearProyecto: jest.fn(),
    ApiCrearTareasBulk: jest.fn(),
}));

jest.mock("@/utils/parsearArchivo", () => ({
    parsearArchivoTareas: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
    useUserContext: jest.fn(),
}));

describe("ProyectoForm", () => {
    const onProyectoCreado = jest.fn();
    const onClose = jest.fn();
    const setError = jest.fn();
    const setErroresFilas = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useUserContext as jest.Mock).mockReturnValue({
            user: { id: 1 },
            token: "fake-token",
        });
    });

    const renderComponent = () =>
        render(
            <ProyectoForm
                onProyectoCreado={onProyectoCreado}
                onClose={onClose}
                setError={setError}
                setErroresFilas={setErroresFilas}
            />
        );

    it("renderiza el formulario", () => {
        renderComponent();

        expect(screen.getByText("Título:")).toBeInTheDocument();
        expect(screen.getByText("Descripción:")).toBeInTheDocument();
        expect(screen.getByText(/subir archivo/i)).toBeInTheDocument();
    });

    it("crea proyecto sin archivo", async () => {
        (ApiCrearProyecto as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 1,
                titulo: "Proyecto Test",
                descripcion: "Descripcion",
                fechaCreacion: "2026-06-01",
                lider: { id: 1, nombre: "Sofia", apellido: "Piombetti", email: "", rol_admin: true },
            }),
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Título"), {
            target: { value: "Proyecto Test" },
        });

        fireEvent.change(screen.getByPlaceholderText("Descripción"), {
            target: { value: "Descripcion" },
        });

        fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

        await waitFor(() => {
            expect(ApiCrearProyecto).toHaveBeenCalled();
            expect(onProyectoCreado).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it("muestra error si falla creación de proyecto", async () => {
        (ApiCrearProyecto as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Error backend" }),
        });

        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

        await waitFor(() => {
            expect(setError).toHaveBeenCalled();
        });
    });

    it("maneja bulk upload con errores de filas", async () => {
        (ApiCrearProyecto as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1 }),
        });

        (parsearArchivoTareas as jest.Mock).mockResolvedValue([]);
        (ApiCrearTareasBulk as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({
                mensaje: "Errores en archivo",
                errores: [{ fila: 1, mensajes: ["Error"] }],
            }),
        });

        renderComponent();

        const file = new File(["dummy"], "test.csv", { type: "text/csv" });

        fireEvent.change(screen.getByLabelText(/subir archivo/i), {
            target: { files: [file] },
        });

        fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

        await waitFor(() => {
            expect(setError).toHaveBeenCalledWith("Errores en archivo");
            expect(setErroresFilas).toHaveBeenCalled();
        });
    });
});