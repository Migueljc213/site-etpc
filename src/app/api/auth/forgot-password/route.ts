import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Não informar se o usuário existe ou não (segurança)
    if (!user) {
      return NextResponse.json(
        { message: 'Se o email existir, você receberá um link de recuperação' },
        { status: 200 }
      );
    }

    // Gerar token único
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco (usar campos JSON ou criar tabela)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Salvando em um campo JSON temporário
        // Você pode criar uma tabela separada para tokens se preferir
      }
    });

    // Criar link de recuperação
    const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Configurar nodemailer
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Enviar email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@etpc.com.br',
      to: user.email,
      subject: 'Recuperação de Senha - ETPC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Recuperar Senha</h2>
          <p>Olá, ${user.name}!</p>
          <p>Você solicitou a recuperação de senha da sua conta.</p>
          <p>Clique no botão abaixo para redefinir sua senha:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Redefinir Senha
          </a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 12px;">Este link expira em 1 hora.</p>
          <p style="color: #666; font-size: 12px;">Se você não solicitou esta recuperação, ignore este email.</p>
        </div>
      `
    });

    return NextResponse.json({ 
      message: 'Se o email existir, você receberá um link de recuperação' 
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar email de recuperação' },
      { status: 500 }
    );
  }
}

