import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rutasProtegidas = ['/admin', '/home'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const pathname = request.nextUrl.pathname;

  const esRutaProtegida = rutasProtegidas.some((ruta) =>
    pathname.startsWith(ruta)
  );

  if (esRutaProtegida && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && token) {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.rol_admin) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/home/:path*'],
};