import React, {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import api, {
  loginUser,
  registerUser,
} from "../api/torneoApi";

import { roleMap } from "../utils/rolesMap";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // Mantener sesión
  // =========================
  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const savedUser =
      localStorage.getItem(
        "user"
      );

    if (token && savedUser) {

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(
        JSON.parse(savedUser)
      );

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    setLoading(false);

  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (
    email,
    password
  ) => {

    try {

      const res =
        await loginUser({
          email,
          password,
        });

      const {
        token,
        user,
      } = res.data;

      // Decodificar token
      const decoded =
        jwtDecode(token);

      // Buscar rol
      const roleData =
        roleMap[decoded.role] || {
          name: "unknown",
          permissions: [],
        };

      // Usuario enriquecido
      const enrichedUser = {
        ...user,
        role: roleData.name,
        permissions:
          roleData.permissions,
      };

      // Guardar state
      setUser(enrichedUser);

      // Guardar localStorage
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          enrichedUser
        )
      );

      // Axios header
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return {
        success: true,
        token,
        user: enrichedUser,
      };

    } catch (error) {

      console.error(
        "Error login:",
        error.response?.data
          ?.message
      );

      return {
        success: false,
        message:
          error.response?.data
            ?.message ||
          "Error al iniciar sesión",
      };
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (
    username,
    email,
    password
  ) => {

    try {

      const res =
        await registerUser({
          username,
          email,
          password,
        });

      console.log(
        "Respuesta register:",
        res.data
      );

      const {
        token,
        user,
      } = res.data;

      // Decodificar token
      const decoded =
        jwtDecode(token);

      // Buscar rol
      const roleData =
        roleMap[decoded.role] || {
          name: "unknown",
          permissions: [],
        };

      // Usuario enriquecido
      const enrichedUser = {
        ...user,
        role: roleData.name,
        permissions:
          roleData.permissions,
      };

      // Guardar state
      setUser(enrichedUser);

      // Guardar localStorage
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          enrichedUser
        )
      );

      // Axios header
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return {
        success: true,
      };

    } catch (error) {
      console.error(
        "Error register:",
        error.response?.data
          ?.message
      );

      return {
        success: false,
        message:
          error.response?.data
            ?.message ||
          "Error al registrarse",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    delete api.defaults.headers.common[
      "Authorization"
    ];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () =>
  useContext(AuthContext);