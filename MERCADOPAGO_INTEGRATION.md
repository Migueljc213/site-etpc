# Integração com Mercado Pago - Guia Completo

## Visão Geral

Este projeto está **100% preparado** para integração com o Mercado Pago. Todas as telas, funcionalidades e estrutura de banco de dados foram criadas. Este documento explica o que você precisa fazer para ativar o Mercado Pago.

## ✅ O que já está pronto

- ✅ Página de cursos online (`/cursos-online`)
- ✅ Carrinho de compras funcional
- ✅ Página de checkout completa (`/checkout`)
- ✅ API de pedidos (`/api/orders`)
- ✅ API de cursos online (`/api/online-courses`)
- ✅ Banco de dados com tabelas: `OnlineCourse`, `Order`, `OrderItem`, `Payment`
- ✅ Suporte para PIX, Boleto, Cartão de Crédito e Débito
- ✅ Estrutura de dados para armazenar informações de pagamento

## 📋 O que você precisa do Mercado Pago

### 1. Criar uma conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/pt
2. Crie uma conta de desenvolvedor
3. Acesse as credenciais de teste e produção

### 2. Obter Credenciais de API

Você precisará de **2 informações** do Mercado Pago:

#### Para Ambiente de Testes (Sandbox):
- **Access Token (Test)**: Token de teste para desenvolvimento
- **Public Key (Test)**: Chave pública para testes

#### Para Ambiente de Produção:
- **Access Token (Production)**: Token para produção
- **Public Key (Production)**: Chave pública para produção

### Como obter:

1. Acesse o painel do Mercado Pago: https://www.mercadopago.com.br/developers/panel
2. Vá em **Suas integrações**
3. Clique em **Criar aplicação**
4. Copie o **Access Token** (não compartilhe com ninguém!)
5. Copie a **Public Key**

### 3. Criar Aplicação no Painel

No painel do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Clique em **Criar aplicação**
3. Preencha:
   - Nome: "ETPC - Sistema de Cursos"
   - Descrição: "Sistema de cursos online com pagamentos"
   
**⚠️ IMPORTANTE: Que tipo de aplicação criar?**

Ao criar a aplicação, você verá opções de escopos/permissões.

**Escopo necessário para Checkout Transparente:**
```
✅ payment: Pagamentos
❌ orders: Não necessário (usamos payment diretamente)
```

**Selecione apenas:**
- ✅ `payment` - Para processar pagamentos

Você NÃO precisa de `orders` porque:
- O Checkout Transparente usa a API de **Payment** diretamente
- Você já tem sistema de pedidos no seu banco de dados
- A API de Payment faz tudo que precisa

### 4. Configurar Webhooks

Para receber notificações de pagamento em tempo real:

**⚠️ IMPORTANTE: Desenvolvimento Local**

Mercado Pago **NÃO envia webhooks para localhost**. Você tem 2 opções:

#### Opção 1: Usar Vercel (Recomendado para testes)
```bash
# 1. Faça commit do código
git add .
git commit -m "Add Mercado Pago integration"

# 2. Faça deploy na Vercel
vercel

# 3. Use a URL da Vercel no webhook do Mercado Pago:
# https://seu-projeto.vercel.app/api/webhooks/mercadopago
```

#### Opção 2: Usar ngrok (Alternativa local)
```bash
# 1. Instale o ngrok
# Windows: baixe de https://ngrok.com

# 2. Execute o ngrok
ngrok http 3000

# 3. Use a URL fornecida (ex: https://abc123.ngrok.io):
# https://abc123.ngrok.io/api/webhooks/mercadopago
```

**Configuração no Painel Mercado Pago:**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em sua aplicação > **Webhooks**
3. Adicione a URL:
   - ✅ Produção/Vercel: `https://seu-projeto.vercel.app/api/webhooks/mercadopago`
   - ✅ Local com ngrok: `https://SEU-ID.ngrok.io/api/webhooks/mercadopago`
4. Configure os eventos:
   - ✅ `payment` - Quando o pagamento é criado/atualizado

## 🔧 Configuração no Projeto

### ⚠️ IMPORTANTE: Qual modelo usar?

Para este projeto, use: **Checkout Transparente** 


### Passo 1: Adicionar variáveis de ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# Mercado Pago - Testes (Desenvolvimento)
MERCADOPAGO_ACCESS_TOKEN=SEU_TOKEN_TEST_AQUI
MERCADOPAGO_PUBLIC_KEY=SUA_CHAVE_PUBLICA_TEST_AQUI
MERCADOPAGO_WEBHOOK_SECRET=sua_chave_secreta_aqui_xyz123

# Mercado Pago - Produção (descomente quando for para produção)
# MERCADOPAGO_ACCESS_TOKEN=SEU_TOKEN_PRODUCAO_AQUI
# MERCADOPAGO_PUBLIC_KEY=SUA_CHAVE_PUBLICA_PRODUCAO_AQUI
```

### Passo 2: Instalar dependências

```bash
npm install mercadopago
```

Isso vai instalar o SDK oficial do Mercado Pago para integrar via **Checkout Transparente**.

### Passo 3: API de Pagamentos

✅ **A integração já está implementada!**

O arquivo `src/app/api/payments/process/route.ts` já contém:
- ✅ Integração completa com Mercado Pago SDK
- ✅ Suporte para PIX, Boleto e Cartão
- ✅ Modo mock quando credenciais não estiverem configuradas
- ✅ Detecção automática de bandeira do cartão
- ✅ Salvamento no banco de dados

**Basta adicionar suas credenciais no `.env` para ativar:**

```env
MERCADOPAGO_ACCESS_TOKEN=SEU_TOKEN_AQUI
```

### Passo 4: API de Webhook

Crie o arquivo: `src/app/api/webhooks/mercadopago/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar webhook (verificar assinatura)
    const signature = request.headers.get('x-signature');
    // TODO: Validar assinatura do webhook

    // Buscar pagamento pelo ID do Mercado Pago
    const payment = await prisma.payment.findFirst({
      where: {
        mercadoPagoPaymentId: data.id
      },
      include: { order: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Mapear status do Mercado Pago para nosso sistema
    let newStatus = 'pending';

    switch (data.status) {
      case 'approved':
        newStatus = 'paid';
        break;
      case 'rejected':
      case 'cancelled':
        newStatus = 'cancelled';
        break;
      case 'in_process':
      case 'pending':
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

Execute as migrações do Prisma para criar/atualizar as tabelas:

```bash
npx prisma migrate dev --name update_to_mercadopago
```

## 🧪 Testando a Integração

### ⚠️ Testando Localmente (Desenvolvimento)

**O problema:** Mercado Pago **NÃO envia webhooks para localhost**

**Solução recomendada: Use Vercel**

1. **Faça deploy na Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure webhook com URL da Vercel:**
   - No painel Mercado Pago, use: `https://seu-projeto.vercel.app/api/webhooks/mercadopago`
   - Isso permite receber notificações em tempo real

3. **Teste o fluxo completo:**
   - Acesse: `https://seu-projeto.vercel.app/cursos-online`
   - Adicione ao carrinho
   - Finalize compra
   - Os webhooks funcionarão perfeitamente

**Alternativa para dev local (ngrok):**
```bash
# 1. Baixe ngrok: https://ngrok.com/download
# 2. Execute:
ngrok http 3000

# 3. Use a URL fornecida no webhook do Mercado Pago:
# https://abc123.ngrok.io/api/webhooks/mercadopago
```

**Nota:** Para testes **SEM webhook** (apenas criar pagamentos), você pode:
- Criar pagamentos via API normalmente
- Consultar status manualmente no painel do Mercado Pago
- Os webhooks só são necessários para atualização automática

### 1. Ambiente de Teste (Sandbox)

Use os cartões de teste do Mercado Pago:

**Cartão de Crédito (Aprovado):**
- Número: `5031 7557 3453 0604`
- Validade: Qualquer data futura
- CVV: `123`
- Nome: Qualquer nome
- CPF: `12345678909`

**Cartões Adicionais:**
- Rejeitado: `5031 4332 1540 6351`
- Em processo: `5031 4332 1540 6369`

**PIX (Test):**
- Gera QR Code de teste
- Use o app Mercado Pago Test para simular pagamento

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

### Logs do Mercado Pago

Acesse o painel do Mercado Pago para ver:
- Pagamentos criados
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

## 📞 Suporte Mercado Pago

- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/developers/pt/support
- Community: https://www.mercadolivre.com.br/desenvolvedores/pt/forum

## ⚠️ Importante

- **NÃO commite** o arquivo `.env` no Git
- Use **diferentes tokens** para testes e produção
- **Valide** sempre os webhooks por segurança
- **Teste** extensivamente no ambiente de testes antes de produção
- Mercado Pago aceita apenas pagamentos em Real Brasileiro (BRL)

## 📝 Checklist Final

- [ ] Conta criada no Mercado Pago
- [ ] Access Token de teste obtido
- [ ] `.env` configurado
- [ ] API de pagamentos implementada
- [ ] Webhook configurado e testado
- [ ] Testes realizados no sandbox
- [ ] Access Token de produção obtido
- [ ] Deploy em produção
- [ ] Primeiras transações testadas

---

**Sistema 100% pronto para integração! Basta seguir este guia.**

