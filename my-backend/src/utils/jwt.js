import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '1m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '30d';



export function signAccess(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccess(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function signRefresh(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyRefresh(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
