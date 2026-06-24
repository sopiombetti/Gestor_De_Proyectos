import { render, screen, fireEvent } from "@testing-library/react";
import {
  UserProvider,
  useUserContext,
} from "../userContext";

function TestComponent() {
  const {
    user,
    token,
    login,
    logout,
  } = useUserContext();

  return (
    <>
      <div data-testid="user">
        {user ? user.nombre : "sin usuario"}
      </div>

      <div data-testid="token">
        {token ?? "sin token"}
      </div>

      <button
        onClick={() =>
          login(
            {
              id: 1,
              nombre: "Juan",
              isAdmin: true,
            },
            "token123"
          )
        }
      >
        Login
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </>
  );
}

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("inicia sin usuario ni token", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("sin usuario");

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("sin token");
  });

  it("login guarda usuario y token", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("Juan");

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("token123");
  });

  it("login guarda datos en localStorage", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    expect(
      localStorage.getItem("token")
    ).toBe("token123");

    expect(
      localStorage.getItem("user")
    ).toBe(
      JSON.stringify({
        id: 1,
        nombre: "Juan",
        isAdmin: true,
      })
    );
  });

  it("logout elimina usuario y token", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(
      screen.getByText("Login")
    );

    fireEvent.click(
      screen.getByText("Logout")
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("sin usuario");

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("sin token");

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });

  it("useUserContext lanza error fuera del provider", () => {
    const spy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      render(<TestComponent />)
    ).toThrow(
      "useAuth debe usarse dentro de UserProvider"
    );

    spy.mockRestore();
  });
});