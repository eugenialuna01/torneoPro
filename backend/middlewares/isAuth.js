import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuth = async (
  req,
  res,
  next
) => {

  try {

    // Obtener header
    const authHeader =
      req.headers.authorization;

    // Verificar si existe
    if (!authHeader) {

      return res.status(403).json({
        message:
          "Por favor, inicie sesión"
      });
    }

    // Extraer token
    const token =
      authHeader.split(" ")[1];

    // Verificar token
    const decodedData =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    if (!decodedData) {

      return res.status(403).json({
        message: "Token expirado"
      });
    }

    // Buscar usuario
    req.user =
      await User.findById(
        decodedData.id
      );

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Token inválido"
    });
  }
};