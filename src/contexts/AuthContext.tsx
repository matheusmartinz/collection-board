import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null); // ------- MUDAR AQUi

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Credenciais de teste para desenvolvimento
    if (username === "admin" && password === "admin") {
      const testToken = "test-token-admin-dev";
      localStorage.setItem("auth_token", testToken);
      setToken(testToken);
      return { success: true };
    }

    try {
      const response = await fetch("https://eboard.service.bck.peon.tec.br/auth/login", {
        method: "POST", // ----------- MUDAR AQUI
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return { success: false, error: "Usuário ou senha inválidos" };
      }

      const data = await response.json();
      const authToken = data.token;

      localStorage.setItem("auth_token", authToken);
      setToken(authToken);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro ao conectar com o servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
