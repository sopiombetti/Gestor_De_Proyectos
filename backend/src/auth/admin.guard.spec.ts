import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

const contextConUsuario = (user: unknown): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext);

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('permite el acceso si el usuario es admin', () => {
    const context = contextConUsuario({ id: 1, rol_admin: true });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('lanza ForbiddenException si el usuario no es admin', () => {
    const context = contextConUsuario({ id: 1, rol_admin: false });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('lanza ForbiddenException si no hay usuario en la request', () => {
    const context = contextConUsuario(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('lanza ForbiddenException si rol_admin no es estrictamente true', () => {
    const context = contextConUsuario({ id: 1, rol_admin: 'true' });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
