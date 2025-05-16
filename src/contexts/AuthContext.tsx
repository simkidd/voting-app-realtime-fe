import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { login as apiLogin, logout as apiLogout, getMe } from "../api/auth";
import type { User } from "../interfaces/user.interface";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (corporateId: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("vote_token");
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data);
        } catch (error) {
          console.error("Session validation failed:", error);
          Cookies.remove("vote_token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (corporateId: string, pin: string) => {
    setLoading(true);
    try {
      const res = await apiLogin({ corporateId, pin });
      const data = res.data;
      setUser(data.user);
      Cookies.set("vote_token", data.token);
      toast.success(res.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
      Cookies.remove("vote_token");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
