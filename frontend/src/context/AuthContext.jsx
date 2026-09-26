import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getCurrentAdmin, loginAdmin, logoutAdmin } from "@/api/authApi";

import queryClient from "@/lib/queryClient";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const sessionVersion = useRef(0);
  const hasSession = useRef(false);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const version = ++sessionVersion.current;
    try {
      const response = await getCurrentAdmin();

      if (version === sessionVersion.current) {
        hasSession.current = true;
        setAdmin(response.admin);
      }
    } catch {
      if (version === sessionVersion.current) {
        if (hasSession.current) {
          await queryClient.cancelQueries();
          if (version !== sessionVersion.current) return;
          queryClient.clear();
        }
        hasSession.current = false;
        setAdmin(null);
      }
    } finally {
      if (version === sessionVersion.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    const response = await loginAdmin(credentials);
    ++sessionVersion.current;
    await queryClient.cancelQueries();
    queryClient.clear();
    setIsLoading(false);
    hasSession.current = true;
    setAdmin(response.admin);

    return response;
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    ++sessionVersion.current;
    await queryClient.cancelQueries();
    queryClient.clear();
    hasSession.current = false;
    setAdmin(null);
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [admin, isLoading, login, logout, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
