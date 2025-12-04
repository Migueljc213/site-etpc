import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { empresa, responsavel, email, telefone, assunto, mensagem } = body;

    // Validar dados obrigatórios
    if (!empresa || !responsavel || !email || !telefone || !assunto) {
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

    // Salvar no banco de dados usando o modelo Contact
    const contact = await prisma.contact.create({
      data: {
        name: responsavel,
        email,
        phone: telefone,
        subject: assunto,
        message: mensagem || '',
        type: 'company',
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { 
        message: 'Solicitação de treinamento in-company enviada com sucesso!',
        id: contact.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao processar solicitação in-company:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { type: 'company' },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Erro ao buscar contatos in-company:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
