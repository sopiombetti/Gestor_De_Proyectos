import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReporteButton from "@/components/admin/ReporteButton";
import { ApiGetReporte } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

jest.mock("@/utils/api", () => ({
  ApiGetReporte: jest.fn(),
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

describe("ReporteButton", () => {
  const setError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUserContext as jest.Mock).mockReturnValue({
      token: "fake-token",
    });

    global.URL.createObjectURL = jest.fn(() => "blob:url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("descarga el reporte correctamente", async () => {
    const blob = new Blob(["pdf"], { type: "application/pdf" });

    (ApiGetReporte as jest.Mock).mockResolvedValue({
      ok: true,
      blob: async () => blob,
    });

    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(<ReporteButton proyectoId={1} setError={setError} />);

    fireEvent.click(screen.getByText(/generar informe/i));

    await waitFor(() => {
      expect(ApiGetReporte).toHaveBeenCalledWith(1, "fake-token");
      expect(clickSpy).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  it("setea error si response no es ok", async () => {
    (ApiGetReporte as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<ReporteButton proyectoId={1} setError={setError} />);

    fireEvent.click(screen.getByText(/generar informe/i));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(
        "No se puede obtener el reporte."
      );
    });
  });

  it("loggea error si falla la request", async () => {
    (ApiGetReporte as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ReporteButton proyectoId={1} setError={setError} />);

    fireEvent.click(screen.getByText(/generar informe/i));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});