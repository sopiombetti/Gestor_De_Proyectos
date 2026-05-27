import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type User = {
  id: number;
  nombre: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (
    user: User,
    token: string
  ) => void;
  logout: () => void;
};

const UserContext = createContext<AuthContextType | null>(null);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function login(user: User, token: string) {
    setUser(user);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
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