import type { SignOptions } from 'jsonwebtoken';

export const JWT_SECRET = 'gestor-proyectos-secret-key';

export const JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1h';