# 🎯 Configuração Rápida: Mercado Pago Checkout Transparente

## Resumo Executivo

**Use:** ✅ **Checkout Transparente**  
**Não use:** ❌ Checkout Pro | ❌ Bricks

## Por quê Checkout Transparente?

1. ✅ **Controle total** da experiência do usuário
2. ✅ **Integração perfeita** com seu banco de dados
3. ✅ **Todos os métodos** de pagamento (PIX, Boleto, Cartão)
4. ✅ **Mais seguro** - processamento no servidor
5. ✅ **Sem redirecionamento** - cliente fica no seu site

## Credenciais Necessárias

### Ambiente de Testes
```
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxx
```

### Ambiente de Produção
```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxxxxxxxxx
```

## Como Obter

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login
3. Vá em **Suas integrações**
4. Clique em **Criar aplicação**
5. Ao criar, selecione:
   - ✅ **payment** (Pagamentos)
   - ❌ ~~orders~~ (NÃO selecione)
6. Copie o **Access Token** e **Public Key**

**Por quê só "payment"?**
- Para Checkout Transparente, só precisa da API de pagamentos
- Orders é usado em outros modelos (Checkout Pro, etc)
- Você já tem sistema de pedidos próprio

## Configuração no Projeto

### 1. Adicione ao `.env`:
```env
MERCADOPAGO_ACCESS_TOKEN=SEU_TOKEN_AQUI
MERCADOPAGO_PUBLIC_KEY=SUA_CHAVE_AQUI
```

### 2. Instale o SDK:
```bash
npm install mercadopago
```

### 3. Use no código:
```typescript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

const payment = new Payment(client);
```

## Fluxo de Pagamento

### PIX
1. Usuário preenche dados no checkout
2. Sistema cria pagamento PIX via API
3. Retorna QR Code
4. Usuário paga via app
5. Webhook confirma pagamento

### Cartão
1. Usuário preenche dados do cartão
2. Sistema processa via API (PCI compliant)
3. Retorna aprovado/rejeitado
4. Webhook confirma (se pendente)

### Boleto
1. Usuário preenche dados
2. Sistema gera boleto via API
3. Retorna código de barras
4. Webhook confirma quando pago

## Testes

### Cartão de Teste (Sempre Aprovado)
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Validade: Qualquer data futura
- Nome: Qualquer nome

### PIX de Teste
- Cria QR Code real
- Pague com app sandbox

## Webhook

URL: `https://seu-dominio.com/api/webhooks/mercadopago`

Eventos:
- ✅ `payment` - Pagamento criado/atualizado
- ✅ `payment.updated` - Status mudou

## Documentação Completa

Consulte: [MERCADOPAGO_INTEGRATION.md](./MERCADOPAGO_INTEGRATION.md)

## Conclusão

**Use Checkout Transparente** para manter controle total e segurança máxima! 🔒

