import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskDetail from "@/pages/taskDetail";
import { ApiGetTareaPorId, ApiEditarTarea } from "@/utils/api";

jest.mock("next/router", () => ({
    useRouter: () => ({
        query: { id: "1" },
    }),
}));

jest.mock("@/utils/userContext", () => ({
    useUserContext: () => ({
        token: "fake-token",
    }),
}));

jest.mock("@/utils/api", () => ({
    ApiGetTareaPorId: jest.fn(),
    ApiEditarTarea: jest.fn(),
}));

const tareaMock = {
    id: 1,
    titulo: "Tarea test",
    descripcion: "Descripción test",
    estimacion: 2,
    estado: { id: 1, nombre: "Sin Asignar", codigo: "SIN_ASIGNAR" },
    prioridad: { id: 1, nombre: "Alta" },
    usuario: {
        id: 1,
        nombre: "Juan",
        apellido: "Perez",
        email: "test@test.com",
        rol_admin: false,
    },
    proyectoid: 1,
    tiempoFinal: 5,
};

describe("TaskDetail page", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (ApiGetTareaPorId as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => tareaMock,
        });

        (ApiEditarTarea as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
    });

    it("renderiza la tarea correctamente", async () => {
        render(<TaskDetail />);

        expect(await screen.findByText("Tarea test")).toBeInTheDocument();
        expect(screen.getByText("Descripción test")).toBeInTheDocument();
    });

    it("permite cambiar estado y guardar cambios", async () => {
        render(<TaskDetail />);

        await screen.findByText("Tarea test");

        const button = screen.getByText("Guardar cambios");
        fireEvent.click(button);

        await waitFor(() => {
            expect(ApiEditarTarea).toHaveBeenCalled();
        });
    });

    // it("muestra error si falla el fetch", async () => {
    //     (ApiGetTareaPorId as jest.Mock).mockResolvedValueOnce({
    //         ok: false,
    //         json: async () => ({
    //             message: "No se pudo obtener la tarea.",
    //         }),
    //     });

    //     render(<TaskDetail />);

    //     expect(await screen.findByText("Cargando...")).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(
    //             screen.getByText(/no se pudo obtener la tarea/i)
    //         ).toBeInTheDocument();
    //     });
    // });
});