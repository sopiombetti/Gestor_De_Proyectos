import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/login";
import { ApiLogin } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

const pushMock = jest.fn();
const loginMock = jest.fn();

jest.mock("@/utils/api", () => ({
  ApiLogin: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: pushMock,
    };
  },
}));

jest.mock("@/utils/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

jest.mock("@/components/Error", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <div>{text}</div>,
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUserContext as jest.Mock).mockReturnValue({
      login: loginMock,
    });
  });

  it("renderiza correctamente el formulario", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", {
        name: /Iniciá sesión en tu cuenta/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("📧 ejemplo@gmail.com")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("🔒 Contraseña")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /ingresar/i,
      })
    ).toBeInTheDocument();
  });

  it("realiza login correctamente", async () => {
    (ApiLogin as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        nombre: "Juan",
        isAdmin: true,
        token: "123abc",
      }),
    });

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("📧 ejemplo@gmail.com"),
      {
        target: {
          value: "juan@test.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("🔒 Contraseña"),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /ingresar/i,
      })
    );

    await waitFor(() => {
      expect(ApiLogin).toHaveBeenCalledWith(
        "juan@test.com",
        "123456"
      );
    });

    expect(loginMock).toHaveBeenCalledWith(
      {
        id: 1,
        nombre: "Juan",
        isAdmin: true,
      },
      "123abc"
    );

    expect(pushMock).toHaveBeenCalledWith("/home");
  });

  it("muestra error cuando las credenciales son incorrectas", async () => {
    (ApiLogin as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("📧 ejemplo@gmail.com"),
      {
        target: {
          value: "juan@test.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("🔒 Contraseña"),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /ingresar/i,
      })
    );

    expect(
      await screen.findByText("Credenciales incorrectas")
    ).toBeInTheDocument();

    expect(loginMock).not.toHaveBeenCalled();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("maneja errores de la API", async () => {
    (ApiLogin as jest.Mock).mockRejectedValue(
      new Error("Error")
    );

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText("📧 ejemplo@gmail.com"),
      {
        target: {
          value: "juan@test.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("🔒 Contraseña"),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /ingresar/i,
      })
    );

    await waitFor(() => {
      expect(ApiLogin).toHaveBeenCalled();
    });

    expect(loginMock).not.toHaveBeenCalled();

    expect(pushMock).not.toHaveBeenCalled();
  });
});