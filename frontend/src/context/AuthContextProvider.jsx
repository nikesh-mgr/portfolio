import { useCallback, useEffect, useMemo, useState } from "react";

import { getCurrentAdmin, loginAdmin, logoutAdmin } from "@/api/authApi";

import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await getCurrentAdmin();

      setAdmin(response?.admin ?? null);
    } catch (error) {
      if (error?.response?.status === 401) {
        setAdmin(null);
        return;
      }

      setAdmin(null);
      setAuthError(
        "We couldn't verify your session. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    setAuthError(null);

    const response = await loginAdmin(credentials);

    setAdmin(response?.admin ?? null);

    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
      setAuthError(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      isLoading,
      authError,
      login,
      logout,
      checkAuth,
    }),
    [admin, isLoading, authError, login, logout, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
