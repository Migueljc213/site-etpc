import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(
  email: string,
  order: any,
  paymentMethod: string
) {
  // Se não houver configuração de email, apenas log
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Email não configurado. Log apenas:');
    console.log('Enviar confirmação de pedido para:', email);
    return;
  }

  try {
    const courseList = order.items
      .map((item: any) => `• ${item.course.title}`)
      .join('\n');

    const paymentMethodNames: Record<string, string> = {
      pix: 'PIX',
      boleto: 'Boleto Bancário',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito'
    };

    await transporter.sendMail({
      from: `"${process.env.SITE_NAME || 'ETPC'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ Pedido Confirmado - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; }
            .btn { display: inline-block; background: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pedido Confirmado!</h1>
              <p>Pedido: ${order.orderNumber}</p>
            </div>
            
            <div class="content">
              <p>Olá, <strong>${order.customerName}</strong>!</p>
              
              <p>Seu pedido foi confirmado com sucesso!</p>
              
              <div class="order-info">
                <h3>📚 Cursos Adquiridos:</h3>
                <pre style="white-space: pre-wrap; font-family: Arial;">${courseList}</pre>
              </div>
              
              <div class="order-info">
                <h3>💰 Informações de Pagamento:</h3>
                <p><strong>Método:</strong> ${paymentMethodNames[paymentMethod] || paymentMethod}</p>
                <p><strong>Valor Total:</strong> R$ ${Number(order.total).toFixed(2)}</p>
              </div>
              
              <p>Você receberá um email com as informações de acesso aos cursos em breve.</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="btn">
                  Acessar Cursos
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p>Atenciosamente,<br>Equipe ${process.env.SITE_NAME || 'ETPC'}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('📧 Email de confirmação enviado para:', email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    // Não falha a operação se o email falhar
  }
}

