import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No se proporcionó un token de autenticación.');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      request.user = jwt.verify(token, this.config.get<string>('JWT_SECRET')!);
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}