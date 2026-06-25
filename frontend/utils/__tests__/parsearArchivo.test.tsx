import * as XLSX from "xlsx";
import { parsearArchivoTareas } from "../parsearArchivo";

jest.mock("xlsx", () => ({
    read: jest.fn(),
    utils: {
        sheet_to_json: jest.fn(),
    },
}));

describe("parsearArchivoTareas", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("parsea correctamente las filas", async () => {
        const fakeFile = {
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;

        (XLSX.read as jest.Mock).mockReturnValue({
            SheetNames: ["Hoja1"],
            Sheets: {
                Hoja1: {},
            },
        });

        (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([
            {
                Titulo: "Tarea 1",
                Descripcion: "Descripción 1",
                Prioridad: "Alta",
                Email: "juan@test.com",
            },
        ]);

        const resultado = await parsearArchivoTareas(fakeFile);

        expect(resultado).toEqual([
            {
                titulo: "Tarea 1",
                descripcion: "Descripción 1",
                prioridad: "Alta",
                email: "juan@test.com",
            },
        ]);
    });

    it("normaliza nombres de columnas con mayúsculas y acentos", async () => {
        const fakeFile = {
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;

        (XLSX.read as jest.Mock).mockReturnValue({
            SheetNames: ["Hoja1"],
            Sheets: {
                Hoja1: {},
            },
        });

        (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([
            {
                TÍTULO: "Tarea Excel",
                DESCRIPCIÓN: "Texto",
                PRIORIDAD: "Media",
            },
        ]);

        const resultado = await parsearArchivoTareas(fakeFile);

        expect(resultado).toEqual([
            {
                titulo: "Tarea Excel",
                descripcion: "Texto",
                prioridad: "Media",
                email: undefined,
            },
        ]);
    });

    it("elimina espacios sobrantes", async () => {
        const fakeFile = {
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;

        (XLSX.read as jest.Mock).mockReturnValue({
            SheetNames: ["Hoja1"],
            Sheets: {
                Hoja1: {},
            },
        });

        (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([
            {
                titulo: "Tarea 1",
                descripcion: "Descripción",
                prioridad: "Alta",
                email: "mail@test.com",
            },
        ]);

        const resultado = await parsearArchivoTareas(fakeFile);

        expect(resultado).toEqual([
            {
                titulo: "Tarea 1",
                descripcion: "Descripción",
                prioridad: "Alta",
                email: "mail@test.com",
            },
        ]);
    });

    it("filtra filas completamente vacías", async () => {
        const fakeFile = {
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;

        (XLSX.read as jest.Mock).mockReturnValue({
            SheetNames: ["Hoja1"],
            Sheets: {
                Hoja1: {},
            },
        });

        (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([
            {
                titulo: "",
                descripcion: "",
                prioridad: "",
                email: "",
            },
            {
                titulo: "Tarea válida",
                descripcion: "",
                prioridad: "",
            },
        ]);

        const resultado = await parsearArchivoTareas(fakeFile);

        expect(resultado).toEqual([
            {
                titulo: "Tarea válida",
                descripcion: "",
                prioridad: "",
                email: undefined,
            },
        ]);
    });

    it("llama a XLSX.read y sheet_to_json", async () => {
        const fakeFile = {
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;

        (XLSX.read as jest.Mock).mockReturnValue({
            SheetNames: ["Hoja1"],
            Sheets: {
                Hoja1: {},
            },
        });

        (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([]);

        await parsearArchivoTareas(fakeFile);

        expect(XLSX.read).toHaveBeenCalled();
        expect(XLSX.utils.sheet_to_json).toHaveBeenCalled();
        expect(fakeFile.arrayBuffer).toHaveBeenCalled();
    });
});