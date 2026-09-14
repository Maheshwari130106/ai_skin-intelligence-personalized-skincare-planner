import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  const fetchMe = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await client.get("/users/me");

      setUser(res.data);
    } catch (error) {
      console.error("Authentication check failed:", error);

      // Only remove token when backend says unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL AUTH CHECK
  // =========================================================

  useEffect(() => {
    fetchMe();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    try {
      const res = await client.post(
        "/auth/login",
        form,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data?.access_token;

      if (!token) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      // Save JWT
      localStorage.setItem(
        "access_token",
        token
      );

      // Save user
      setUser(res.data.user);

      console.log(
        "Access token saved successfully."
      );

      return res.data.user;
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // LOGIN WITH TOKEN
  // =========================================================

  const loginWithToken = async (token) => {
    try {
      localStorage.setItem(
        "access_token",
        token
      );

      const res =
        await client.get("/users/me");

      setUser(res.data);

      return res.data;
    } catch (error) {
      localStorage.removeItem(
        "access_token"
      );

      setUser(null);

      throw error;
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (payload) => {
    await client.post(
      "/auth/register",
      payload
    );

    return login(
      payload.email,
      payload.password
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithToken,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);