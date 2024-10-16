import crypto from 'crypto';

const secretKey = "burnie-john";

// Expiration times in human-readable format
const CUSTOM_TOKEN_EXPIRATION_MINUTES = 15; // 15 minutes
const REFRESH_TOKEN_EXPIRATION_DAYS = 30; // 30 days

// Convert human-readable format to seconds
const CUSTOM_TOKEN_EXPIRATION_SECONDS = CUSTOM_TOKEN_EXPIRATION_MINUTES * 60;
const REFRESH_TOKEN_EXPIRATION_SECONDS = REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60;

let isValidationEnabled = true; // Global variable to control validation

const base64UrlEncode = (str: string): string => Buffer.from(str).toString('base64url');

const generateSignature = (header: string, payload: string): string => {
    return crypto
        .createHmac('sha256', secretKey)
        .update(`${header}.${payload}`)
        .digest('base64url');
};

const generateToken = (user: { id: number, userName: string, email: string }, expiresIn: number): string => {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const payload = JSON.stringify({
        id: user.id,
        userName: user.userName,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    });

    const base64Header = base64UrlEncode(header);
    const base64Payload = base64UrlEncode(payload);
    const signature = generateSignature(base64Header, base64Payload);

    return `${base64Header}.${base64Payload}.${signature}`;
};

const validateToken = (token: string): boolean => {
    if (!isValidationEnabled) {
        return true;
    }

    const [header, payload, signature] = token.split('.');

    const expectedSignature = generateSignature(header, payload);
    if (signature !== expectedSignature) {
        return false;
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedPayload.exp >= currentTime;
};

const generateCustomToken = (user: { id: number, userName: string, email: string }): string => {
    return generateToken(user, CUSTOM_TOKEN_EXPIRATION_SECONDS);
};

const generateRefreshToken = (user: { id: number, userName: string, email: string }): string => {
    return generateToken(user, REFRESH_TOKEN_EXPIRATION_SECONDS);
};

const validateCustomToken = (token: string): boolean => {
    return validateToken(token);
};

const validateRefreshToken = (token: string): boolean => {
    return validateToken(token);
};

const setValidationEnabled = (enabled: boolean): void => {
    isValidationEnabled = enabled;
};

export { generateCustomToken, validateCustomToken, generateRefreshToken, validateRefreshToken, setValidationEnabled };
