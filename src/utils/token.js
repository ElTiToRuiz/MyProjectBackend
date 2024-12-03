// Generate JWT on successful login
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const APPSTATE = process.env.NODE_ENV
export const ACCESS_CODE = process.env.JWT_SECRET
export const REFRESH_CODE = process.env.JWT_SECRET_REFRESH 

// Función para generar el token de acceso
export function generateAccessToken(user) {
    return jwt.sign(
        { user: user },
        ACCESS_CODE, { expiresIn: '15m' }
    );
}

// Función para generar el token de refresco
export function generateRefreshToken(user) {
    return jwt.sign(
        { user: user }, 
        REFRESH_CODE, { expiresIn: '7d' }
    );
}

function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

export function verifyAccessToken(token) {
    return verifyToken(token, ACCESS_CODE);
} 

export function verifyRefreshToken(token) {
    return verifyToken(token, REFRESH_CODE);
}


export function saveRefreshToken(res, refreshToken) {
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        // domain: "http://localhost:5173",
        // Only on HTTPS in production
        secure: APPSTATE === 'production',
        // Stict means no cross-site request forgery
        // Or 'Lax', depending on your CSRF strategy
        sameSite: 'Strict',
        // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export function saveAccessToken(res, accessToken) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: APPSTATE === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000,
    });
}

// Función para guardar las cookies en HttpOnly
export function saveHttpOnlyCookie(res, accessToken, refreshToken) {
    saveAccessToken(res, accessToken);
    saveRefreshToken(res, refreshToken);
}
