import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "wouter";

interface AuthUser {
  username: string;
  displayName: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("ehs_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [, navigate] = useLocation();

  const login = useCallback(async (username: string, password: string) => {
    // Simulate auth — replace with real API call when backend auth is ready
    if (username && password) {
      const authUser: AuthUser = {
        username,
        displayName: username === "carl.murphy" ? "Carl Murphy" : username,
        role: "Safety Manager",
      };
      setUser(authUser);
      localStorage.setItem("ehs_user", JSON.stringify(authUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("ehs_user");
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
