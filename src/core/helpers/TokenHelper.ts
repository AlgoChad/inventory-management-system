import crypto from 'crypto';

const secretKey = "burnie-john";

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
    return generateToken(user, 15 * 60);
};

const generateRefreshToken = (user: { id: number, userName: string, email: string }): string => {
    return generateToken(user, 30 * 24 * 60 * 60);
};

const validateCustomToken = (token: string): boolean => {
    return validateToken(token);
};

const validateRefreshToken = (token: string): boolean => {
    return validateToken(token);
};

export { generateCustomToken, validateCustomToken, generateRefreshToken, validateRefreshToken };