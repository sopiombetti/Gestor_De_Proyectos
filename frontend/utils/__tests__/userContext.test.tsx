import { render, screen, fireEvent } from "@testing-library/react";
import { UserProvider, useUserContext } from "../userContext";

function TestComponent() {
  const { user, token, login, logout } = useUserContext();

  return (
    <div>
      <span data-testid="user">
        {user ? user.nombre : "Sin usuario"}
      </span>

      <span data-testid="token">
        {token ? token : "Sin token"}
      </span>

      <button
        onClick={() =>
          login(
            {
              id: 1,
              nombre: "Sofia",
              isAdmin: true,
            },
            "abc123"
          )
        }
      >
        Login
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
  });

  test("inicia sin usuario ni token", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("Sin usuario");
    expect(screen.getByTestId("token").textContent).toBe("Sin token");
  });

  test("login actualiza user y token", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByTestId("user").textContent).toBe("Sofia");
    expect(screen.getByTestId("token").textContent).toBe("abc123");
  });

  test("login guarda datos en localStorage", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(localStorage.getItem("token")).toBe("abc123");
    expect(localStorage.getItem("user")).toBe(
      JSON.stringify({
        id: 1,
        nombre: "Sofia",
        isAdmin: true,
      })
    );
  });

  test("logout limpia estado y localStorage", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("user").textContent).toBe("Sin usuario");
    expect(screen.getByTestId("token").textContent).toBe("Sin token");

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});