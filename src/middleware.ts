import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Permitir acesso público a /admin/login - evitar loops
    if (pathname === '/admin/login') {
      // Se já está autenticado como admin, redirecionar para /admin
      if (token && token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      // Se está autenticado mas não é admin, redirecionar para dashboard
      if (token && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // Se não está autenticado, permitir acesso
      return NextResponse.next();
    }

    // Se o usuário está tentando acessar /admin (mas não /admin/login)
    if (pathname.startsWith('/admin')) {
      if (!token) {
        // Não autenticado - redirecionar para login SEM callbackUrl para evitar loops
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
      }
      if (token.role !== 'admin') {
        // Não é admin - redirecionar para dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Se o usuário está tentando acessar /dashboard
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        // Não autenticado - redirecionar para login público
        return NextResponse.redirect(new URL('/login', req.url));
      }
      if (token.role === 'admin') {
        // É admin - redirecionar para /admin
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Permitir acesso público a páginas de login
        if (pathname === '/admin/login' || pathname === '/login') {
          return true;
        }

        // Se não tem token, o middleware vai redirecionar
        if (!token) {
          return false;
        }

        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
};

