import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl.clone();

    // Se o usuário está tentando acessar /admin
    if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
      if (!token || token.role !== 'admin') {
        // Redirecionar alunos para /dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Se o usuário está tentando acessar /dashboard
    if (url.pathname.startsWith('/dashboard')) {
      if (!token || token.role === 'admin') {
        // Redirecionar admins para /admin
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso público a /login
        if (req.nextUrl.pathname === '/login') {
          return true;
        }

        // Se não tem token, redirecionar para login
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

