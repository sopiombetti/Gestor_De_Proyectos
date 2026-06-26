import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

jest.mock('jsonwebtoken');

const armarContext = (authorization?: string) => {
  const request: { headers: Record<string, string | undefined>; user?: unknown } = {
    headers: { authorization },
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
  return { request, context };
};

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    const config = { get: jest.fn().mockReturnValue('test-secret') } as unknown as ConfigService;
    guard = new JwtAuthGuard(config);
    jest.clearAllMocks();
  });

  it('lanza UnauthorizedException si no hay header Authorization', () => {
    const { context } = armarContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si el header no empieza con "Bearer "', () => {
    const { context } = armarContext('Token abc');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si el token es inválido', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid');
    });
    const { context } = armarContext('Bearer token-malo');
    expect(() => guard.canActivate(context)).toThrow('Token inválido o expirado.');
  });

  it('permite el acceso y deja el payload en request.user con un token válido', () => {
    const payload = { id: 1, email: 'a@a.com', rol_admin: true };
    (jwt.verify as jest.Mock).mockReturnValue(payload);
    const { context, request } = armarContext('Bearer token-bueno');

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toBe(payload);
  });
});
