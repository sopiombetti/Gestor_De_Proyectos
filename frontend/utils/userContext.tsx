import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: number;
  nombre: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const UserContext = createContext<AuthContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    if (!cookies) return;
    const savedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (savedToken) {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));

      setToken(savedToken);
      setUser({
        id: payload.id,
        nombre: payload.nombre,
        isAdmin: payload.rol_admin,
      });
    }
  }, []);

  function login(user: User, token: string) {
    setUser(user);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/; max-age=${60 * 60}`;
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = 'token=; path=/; max-age=0';
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de UserProvider");
  }

  return context;
}