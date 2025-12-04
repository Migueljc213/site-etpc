import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // TODO: Validar token no banco de dados
    // Por enquanto, retorna true para qualquer token
    // Implementar verificação real com banco de dados

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

