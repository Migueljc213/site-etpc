import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { responsavel, email, telefone, aluno, ano, nivel, mensagem } = body;

    // Validar dados obrigatórios
    if (!responsavel || !email || !telefone || !aluno || !ano || !nivel) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Salvar no banco de dados
    const matricula = await prisma.matricula.create({
      data: {
        responsavel,
        email,
        telefone,
        aluno,
        ano: parseInt(ano),
        nivel,
        mensagem: mensagem || '',
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { 
        message: 'Solicitação de matrícula enviada com sucesso!',
        id: matricula.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao processar matrícula:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const matriculas = await prisma.matricula.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(matriculas);
  } catch (error) {
    console.error('Erro ao buscar matrículas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
