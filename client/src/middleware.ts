import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Aplicar apenas em rotas do backoffice
  if (request.nextUrl.pathname.startsWith('/backoffice')) {
    // Verificar se há token de acesso no localStorage (isso não funciona em middleware)
    // Por isso vamos usar uma abordagem diferente - deixar o componente fazer a verificação
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/backoffice/:path*']
};