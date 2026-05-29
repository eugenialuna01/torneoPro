import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Middleware para verificar el token de autenticación
export const authenticateToken = (req, res, next) => {

    // Obtenemos el header de autorización
    const authHeader = req.headers['authorization'];

    // Extraemos el token del header (formato: "Bearer <token>")
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, devolvemos error 401
    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    try {

        // Verificamos el token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardamos usuario decodificado
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: 'Token inválido'
        });
    }
};

export const hasPermission = (requiredPermission) => {

    return async (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    message: 'No autenticado'
                });
            }

            // Obtener usuario con rol y permisos
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'role',
                    populate: {
                        path: 'permissions'
                    }
                });

            const permissionExists =
                user.role.permissions.some(
                    permission =>
                        permission.name === requiredPermission
                );

            if (!permissionExists) {

                return res.status(403).json({
                    message:
                        'No tienes permiso para realizar esta acción'
                });
            }

            next();

        } catch (error) {

            next(error);
        }
    };
};
