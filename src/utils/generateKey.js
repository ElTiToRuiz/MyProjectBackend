import crypto from 'node:crypto';

// This will create a 128-character random secret key.
export const secretKey = () => crypto.randomBytes(64).toString('hex');

// This will create a 12 to 16-character random password.
export const genereateRandomPassword = () => {
    const length = Math.floor(Math.random() * 4) + 12;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return password;
}

console.log(secretKey());