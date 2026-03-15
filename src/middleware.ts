import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Rutas públicas (no requieren autenticación)
  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Sin sesión y ruta protegida → redirigir a login
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Con sesión y en login/signup → redirigir al home
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // Excluir archivos estáticos, imágenes, favicon y rutas de API internas
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
