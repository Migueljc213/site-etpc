# Integração com PagSeguro - Guia Completo

## Visão Geral

Este projeto está **100% preparado** para integração com o PagSeguro. Todas as telas, funcionalidades e estrutura de banco de dados foram criadas. Este documento explica o que você precisa fazer para ativar o PagSeguro.

## ✅ O que já está pronto

- ✅ Página de cursos online (`/cursos-online`)
- ✅ Carrinho de compras funcional
- ✅ Página de checkout completa (`/checkout`)
- ✅ API de pedidos (`/api/orders`)
- ✅ API de cursos online (`/api/online-courses`)
- ✅ Banco de dados com tabelas: `OnlineCourse`, `Order`, `OrderItem`, `Payment`
- ✅ Suporte para PIX, Boleto, Cartão de Crédito e Débito
- ✅ Estrutura de dados para armazenar informações de pagamento

## 📋 O que você precisa do PagSeguro

### 1. Criar uma conta no PagSeguro

1. Acesse: https://pagseguro.uol.com.br/
2. Crie uma conta empresarial
3. Complete o cadastro e validação da sua empresa

### 2. Obter Credenciais de API

Você precisará de **3 informações** do PagSeguro:

#### Para Ambiente de Sandbox (Testes):
- **Token de Acesso (Sandbox)**: Usado para testes
- **URL da API**: `https://sandbox.api.pagseguro.com`

#### Para Ambiente de Produção:
- **Token de Acesso (Produção)**: Usado em produção
- **URL da API**: `https://api.pagseguro.com`

### Como obter:

1. Acesse o painel do PagSeguro: https://pagseguro.uol.com.br/
2. Vá em **Integrações** > **Token de Segurança**
3. Gere um novo token com permissões de:
   - ✅ Criar cobranças
   - ✅ Consultar cobranças
   - ✅ Receber webhooks

### 3. Configurar Webhooks

Para receber notificações de pagamento em tempo real:

1. No painel do PagSeguro, vá em **Integrações** > **Webhooks**
2. Configure a URL de webhook para:
   ```
   https://seu-dominio.com/api/webhooks/pagseguro
   ```
3. Marque os eventos:
   - ✅ Pagamento aprovado
   - ✅ Pagamento cancelado
   - ✅ Pagamento em análise
   - ✅ Pagamento devolvido

## 🔧 Configuração no Projeto

### Passo 1: Adicionar variáveis de ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# PagSeguro - Sandbox (Desenvolvimento)
PAGSEGURO_ENVIRONMENT=sandbox
PAGSEGURO_TOKEN=SEU_TOKEN_SANDBOX_AQUI
PAGSEGURO_API_URL=https://sandbox.api.pagseguro.com

# PagSeguro - Produção (descomente quando for para produção)
# PAGSEGURO_ENVIRONMENT=production
# PAGSEGURO_TOKEN=SEU_TOKEN_PRODUCAO_AQUI
# PAGSEGURO_API_URL=https://api.pagseguro.com

# Webhook Secret (gere uma string aleatória segura)
PAGSEGURO_WEBHOOK_SECRET=sua_chave_secreta_aqui_xyz123
```

### Passo 2: Instalar dependências (se necessário)

O projeto já usa `fetch` nativo, mas se preferir usar uma biblioteca:

```bash
npm install axios
# ou
npm install pagseguro-nodejs-sdk
```

### Passo 3: Atualizar API de Pagamentos

Edite o arquivo: `src/app/api/payments/process/route.ts`

Substitua o comentário `// TODO: Implementar integração com PagSeguro` pela implementação real.

#### Exemplo de Integração - PIX:

```typescript
// Criar pedido no PagSeguro
const pagseguroResponse = await fetch(`${process.env.PAGSEGURO_API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PAGSEGURO_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference_id: order.orderNumber,
    customer: {
      name: customerData.name,
      email: customerData.email,
      tax_id: customerData.cpf.replace(/[^\d]/g, ''),
      phones: [{
        country: '55',
        area: customerData.phone.substring(0, 2),
        number: customerData.phone.substring(2).replace(/[^\d]/g, '')
      }]
    },
    items: order.items.map(item => ({
      reference_id: item.courseId,
      name: item.course.title,
      quantity: item.quantity,
      unit_amount: Math.round(Number(item.price) * 100) // Centavos
    })),
    qr_codes: [{
      amount: {
        value: Math.round(Number(order.total) * 100) // Centavos
      }
    }]
  })
});

const pagseguroData = await pagseguroResponse.json();

// Atualizar com dados reais do PagSeguro
paymentData = {
  ...paymentData,
  pagseguroOrderId: pagseguroData.id,
  pixQrCode: pagseguroData.qr_codes[0].links[0].href, // Base64 da imagem
  pixQrCodeText: pagseguroData.qr_codes[0].text,
  pixExpiresAt: new Date(pagseguroData.qr_codes[0].expiration_date)
};
```

#### Exemplo de Integração - Boleto:

```typescript
const pagseguroResponse = await fetch(`${process.env.PAGSEGURO_API_URL}/charges`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PAGSEGURO_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference_id: order.orderNumber,
    customer: {
      name: customerData.name,
      email: customerData.email,
      tax_id: customerData.cpf.replace(/[^\d]/g, ''),
      phones: [{
        country: '55',
        area: customerData.phone.substring(0, 2),
        number: customerData.phone.substring(2).replace(/[^\d]/g, '')
      }]
    },
    items: order.items.map(item => ({
      reference_id: item.courseId,
      name: item.course.title,
      quantity: item.quantity,
      unit_amount: Math.round(Number(item.price) * 100)
    })),
    payment_method: {
      type: 'BOLETO',
      boleto: {
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        instruction_lines: {
          line_1: 'Pagamento referente a cursos online ETPC',
          line_2: 'Não receber após o vencimento'
        }
      }
    }
  })
});

const pagseguroData = await pagseguroResponse.json();

paymentData = {
  ...paymentData,
  pagseguroOrderId: pagseguroData.id,
  pagseguroChargeId: pagseguroData.charges[0].id,
  boletoBarcode: pagseguroData.charges[0].payment_method.boleto.barcode,
  boletoPdf: pagseguroData.charges[0].payment_method.boleto.formatted_barcode,
  boletoExpiresAt: new Date(pagseguroData.charges[0].payment_method.boleto.due_date)
};
```

#### Exemplo de Integração - Cartão de Crédito:

```typescript
const pagseguroResponse = await fetch(`${process.env.PAGSEGURO_API_URL}/charges`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PAGSEGURO_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference_id: order.orderNumber,
    customer: {
      name: customerData.name,
      email: customerData.email,
      tax_id: customerData.cpf.replace(/[^\d]/g, ''),
      phones: [{
        country: '55',
        area: customerData.phone.substring(0, 2),
        number: customerData.phone.substring(2).replace(/[^\d]/g, '')
      }]
    },
    items: order.items.map(item => ({
      reference_id: item.courseId,
      name: item.course.title,
      quantity: item.quantity,
      unit_amount: Math.round(Number(item.price) * 100)
    })),
    payment_method: {
      type: 'CREDIT_CARD',
      installments: 1,
      capture: true,
      card: {
        number: cardData.number.replace(/\s/g, ''),
        exp_month: cardData.expiry.split('/')[0],
        exp_year: `20${cardData.expiry.split('/')[1]}`,
        security_code: cardData.cvv,
        holder: {
          name: cardData.holder
        }
      }
    }
  })
});

const pagseguroData = await pagseguroResponse.json();

paymentData = {
  ...paymentData,
  pagseguroOrderId: pagseguroData.id,
  pagseguroChargeId: pagseguroData.charges[0].id,
  cardBrand: pagseguroData.charges[0].payment_method.card.brand,
  cardLastDigits: pagseguroData.charges[0].payment_method.card.last_digits,
  status: pagseguroData.charges[0].status === 'PAID' ? 'paid' : 'pending'
};
```

### Passo 4: Criar API de Webhook

Crie o arquivo: `src/app/api/webhooks/pagseguro/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar webhook (verificar assinatura)
    const signature = request.headers.get('x-pagseguro-signature');
    // TODO: Validar assinatura do webhook

    // Buscar pagamento pelo ID do PagSeguro
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { pagseguroOrderId: data.id },
          { pagseguroChargeId: data.charges?.[0]?.id }
        ]
      },
      include: { order: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Mapear status do PagSeguro para nosso sistema
    let newStatus = 'pending';
    const chargeStatus = data.charges?.[0]?.status;

    switch (chargeStatus) {
      case 'PAID':
        newStatus = 'paid';
        break;
      case 'DECLINED':
      case 'CANCELED':
        newStatus = 'cancelled';
        break;
      case 'IN_ANALYSIS':
        newStatus = 'processing';
        break;
    }

    // Atualizar pagamento
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paidAt: newStatus === 'paid' ? new Date() : null,
        webhookData: JSON.stringify(data)
      }
    });

    // Atualizar pedido
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: newStatus,
        status: newStatus === 'paid' ? 'completed' : payment.order.status
      }
    });

    // TODO: Enviar email de confirmação para o cliente

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Passo 5: Migrar Banco de Dados

Execute as migrações do Prisma para criar as tabelas:

```bash
npx prisma migrate dev --name add_online_courses_and_payments
```

## 🧪 Testando a Integração

### 1. Ambiente de Sandbox

Use os cartões de teste do PagSeguro:

**Cartão de Crédito (Aprovado):**
- Número: `4111 1111 1111 1111`
- Validade: Qualquer data futura
- CVV: `123`
- Nome: Qualquer nome

**PIX (Sandbox):**
- Gera QR Code de teste
- Use o app PagSeguro Sandbox para simular pagamento

**Boleto (Sandbox):**
- Gera boleto de teste
- Pode simular pagamento pelo painel

### 2. Fluxo de Teste

1. Acesse `/cursos-online`
2. Adicione cursos ao carrinho
3. Vá para `/checkout`
4. Preencha os dados e selecione forma de pagamento
5. Finalize a compra
6. Verifique o banco de dados:
   ```bash
   npx prisma studio
   ```

## 📊 Monitoramento

### Logs do PagSeguro

Acesse o painel do PagSeguro para ver:
- Transações criadas
- Status de pagamentos
- Webhooks recebidos
- Erros de integração

### Banco de Dados

Consulte as tabelas:
- `orders` - Pedidos criados
- `payments` - Pagamentos processados
- `order_items` - Itens dos pedidos

## 🚀 Colocando em Produção

1. **Troque as credenciais** para produção no `.env`
2. **Configure o webhook** com a URL de produção
3. **Teste** com transações reais pequenas
4. **Monitore** os primeiros pagamentos

## 📞 Suporte PagSeguro

- Documentação: https://dev.pagseguro.uol.com.br/
- Suporte: https://pagseguro.uol.com.br/atendimento
- Email: desenvolvedores@pagseguro.com.br

## ⚠️ Importante

- **NÃO commite** o arquivo `.env` no Git
- Use **diferentes tokens** para sandbox e produção
- **Valide** sempre os webhooks por segurança
- **Teste** extensivamente no sandbox antes de produção

## 📝 Checklist Final

- [ ] Conta criada no PagSeguro
- [ ] Token de sandbox obtido
- [ ] `.env` configurado
- [ ] API de pagamentos implementada
- [ ] Webhook configurado e testado
- [ ] Testes realizados no sandbox
- [ ] Token de produção obtido
- [ ] Deploy em produção
- [ ] Primeiras transações testadas

---

**Sistema 100% pronto para integração! Basta seguir este guia.**
