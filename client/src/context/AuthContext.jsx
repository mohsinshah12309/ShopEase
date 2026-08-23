import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// /api/auth/me returns the full Mongoose doc (uses _id),
// while login/register return a plain object with id.
// Normalize both to a consistent shape: { id, name, email, role }.
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, verify/refresh the user via /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem("token");

    const boot = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const normalized = normalizeUser(data.user);
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
      } catch (error) {
        // The axios 401 interceptor already clears storage and redirects.
        // If we get here for another reason, clear the stored user too.
        if (!error.response || error.response.status !== 401) {
          localStorage.removeItem("user");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    const normalized = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    const normalized = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
