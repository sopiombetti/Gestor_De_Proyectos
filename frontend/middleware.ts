import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rutasProtegidas = ['/admin', '/home'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const esRutaProtegida = rutasProtegidas.some((ruta) =>
    request.nextUrl.pathname.startsWith(ruta)
  );

  if (esRutaProtegida && !token) {
    const urlLogin = new URL('/login', request.url);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/home/:path*'],
};
