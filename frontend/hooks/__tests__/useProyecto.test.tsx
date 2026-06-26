import { renderHook, waitFor } from "@testing-library/react";
import { useProyectos } from "@/hooks/useProyectos";
import { ApiGetProyecto } from "@/utils/api";

jest.mock("@/utils/api", () => ({
    ApiGetProyecto: jest.fn(),
}));

describe("useProyectos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("trae proyectos correctamente", async () => {
        (ApiGetProyecto as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id: 1,
                    titulo: "Proyecto test",
                    descripcion: "Descripcion",
                    fechaCreacion: "2026-06-01",
                    lider: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Piombetti",
                        email: "test@test.com",
                        rol_admin: true,
                    },
                },
            ],
        });

        const { result } = renderHook(() =>
            useProyectos(1, "fake-token")
        );

        await waitFor(() => {
            expect(result.current.proyectos.length).toBe(1);
        });

        expect(ApiGetProyecto).toHaveBeenCalledWith(1, "fake-token");
    });

    it("no llama API si falta userId o token", async () => {
        const { result } = renderHook(() =>
            useProyectos(undefined, null)
        );

        expect(result.current.proyectos).toEqual([]);
        expect(ApiGetProyecto).not.toHaveBeenCalled();
    });

    it("maneja error sin romper", async () => {
        const consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });

        (ApiGetProyecto as jest.Mock).mockResolvedValue({
            ok: false,
        });

        renderHook(() => useProyectos(1, "fake-token"));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});