import React, { useCallback, useState } from "react";
import { login, logout, fetchUser, register } from "@/api/auth";
import storage from "@/utils/storage";

const AuthContext = React.createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    const token = storage.getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetchUser({});
      setUser(res.data);
    } catch (error) {
      setUser(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const signUp = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await register(credentials, {});
      storage.setAccessToken(res.data.accessToken);
      storage.setRefreshToken(res.data.refreshToken);
      await fetchCurrentUser();
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        signOut();
      }
      throw new Error(
        error.response?.data?.error || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await login(credentials, {});
      storage.setAccessToken(res.data.accessToken);
      storage.setRefreshToken(res.data.refreshToken);
      await fetchCurrentUser();
    } catch (error: any) {
      setUser(null);
      throw new Error(
        error.response?.data?.error || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!storage.getAccessToken(),
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
