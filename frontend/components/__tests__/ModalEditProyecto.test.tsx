import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalEditarProyecto from "@/components/admin/ModalEditProyecto";
import { ApiEditarProyectoAdmin } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
    ApiEditarProyectoAdmin: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
    useUserContext: jest.fn(),
}));

describe("ModalEditarProyecto", () => {
    const onClose = jest.fn();
    const onGuardado = jest.fn();
    const setError = jest.fn();
    const setSuccess = jest.fn();

    const proyecto = {
        id: 1,
        titulo: "Proyecto Test",
        descripcion: "Descripción Test",
        fechaCreacion: "2024-01-01",
        lider: {
            id: 1,
            nombre: "Juan",
            apellido: "Perez",
            email: "test@test.com",
            rol_admin: true,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useUserContext as jest.Mock).mockReturnValue({
            token: "token-test",
        });
    });

    it("renderiza los datos del proyecto", () => {
        render(
            <ModalEditarProyecto
                proyecto={proyecto}
                onClose={onClose}
                onGuardado={onGuardado}
                setError={setError}
                setSuccess={setSuccess}
            />
        );

        expect(screen.getByDisplayValue("Proyecto Test")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Descripción Test")).toBeInTheDocument();
    });

    it("cierra el modal al hacer click en Cancelar", () => {
        render(
            <ModalEditarProyecto
                proyecto={proyecto}
                onClose={onClose}
                onGuardado={onGuardado}
                setError={setError}
                setSuccess={setSuccess}
            />
        );

        fireEvent.click(screen.getByText("Cancelar"));

        expect(onClose).toHaveBeenCalled();
    });

    it("guarda los cambios correctamente", async () => {
        (ApiEditarProyectoAdmin as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        render(
            <ModalEditarProyecto
                proyecto={proyecto}
                onClose={onClose}
                onGuardado={onGuardado}
                setError={setError}
                setSuccess={setSuccess}
            />
        );

        fireEvent.change(screen.getByDisplayValue("Proyecto Test"), {
            target: { value: "Proyecto Nuevo" },
        });

        fireEvent.change(screen.getByDisplayValue("Descripción Test"), {
            target: { value: "Nueva descripción" },
        });

        fireEvent.click(screen.getByText("Guardar"));

        await waitFor(() => {
            expect(ApiEditarProyectoAdmin).toHaveBeenCalledWith(
                1,
                {
                    titulo: "Proyecto Nuevo",
                    descripcion: "Nueva descripción",
                },
                "token-test"
            );
        });

        expect(onGuardado).toHaveBeenCalledWith({
            ...proyecto,
            titulo: "Proyecto Nuevo",
            descripcion: "Nueva descripción",
        });

        expect(onClose).toHaveBeenCalled();
    });

    it("maneja error al guardar", async () => {
        (ApiEditarProyectoAdmin as jest.Mock).mockResolvedValue({
            ok: false,
        });

        const consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });

        render(
            <ModalEditarProyecto
                proyecto={proyecto}
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