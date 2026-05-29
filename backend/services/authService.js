import User from '../models/User.js';
import Role from '../models/Roles.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {

    // Método para registrar un nuevo usuario
    async register(userData) {

        // Verificamos si ya existe un usuario
        const existingUser = await User.findOne({
            $or: [
                { email: userData.email },
                { username: userData.username }
            ]
        });

        // Si existe lanzamos error
        if (existingUser) {
            throw new Error('Usuario o email ya existe');
        }

        // Encriptamos contraseña
        const hashedPassword = await bcrypt.hash(
            userData.password,
            10
        );

        // Buscamos rol por defecto
        const defaultRole = await Role.findOne({
            name: 'user'
        });

        if (!defaultRole) {
            throw new Error(
                'Rol por defecto no encontrado'
            );
        }

        // Creamos usuario
        const user = new User({
            ...userData,
            password: hashedPassword,
            role: defaultRole._id
        });

        // Guardamos
        await user.save();

        // Convertimos a objeto plano
        const userResponse = user.toObject();

        // Eliminamos password
        delete userResponse.password;

        // Generamos token
        const token = this.generateToken(user);

        // Retornamos respuesta
        return {
            user: userResponse,
            token
        };
    }

    // Método login
    async login(email, password) {

        // Buscamos usuario
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error(
                'Usuario no encontrado'
            );
        }

        // Verificamos password
        const isValidPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isValidPassword) {
            throw new Error(
                'Correo o contraseña incorrectos'
            );
        }

        // Eliminamos password
        const userResponse = user.toObject();

        delete userResponse.password;

        // Generamos token
        const token = this.generateToken(user);

        return {
            user: userResponse,
            token
        };
    }

    // Método auxiliar JWT
    generateToken(user) {

        return jwt.sign(
            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '24h'
            }
        );
    }
}

export default new AuthService();