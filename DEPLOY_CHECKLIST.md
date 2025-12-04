# ✅ Checklist de Deploy - Mercado Pago

## Status Atual: 🟡 PRONTO PARA DEPLOY

### ✅ O que já está configurado:

1. ✅ **SDK instalado**
   - `mercadopago` instalado via npm

2. ✅ **Integração implementada**
   - `src/app/api/payments/process/route.ts` com código completo
   - Suporta PIX, Boleto e Cartão
   - Modo mock se credenciais não estiverem configuradas

3. ✅ **Webhook criado**
   - `src/app/api/webhooks/mercadopago/route.ts` implementado
   - Recebe e processa notificações

4. ✅ **Banco de dados atualizado**
   - Schema com campos do Mercado Pago
   - Campos: `mercadoPagoPaymentId`, etc.

5. ✅ **Credenciais configuradas**
   - Adicionadas no `.env`
   - Adicionadas na Vercel

6. ✅ **Webhook configurado no Mercado Pago**
   - URL configurada na Vercel

---

## 🚀 Próximos Passos

### 1. Fazer Deploy na Vercel

```bash
# Se ainda não tiver feito:
git add .
git commit -m "Add Mercado Pago integration"
git push origin main

# Ou fazer deploy manual:
vercel
```

### 2. Verificar Deploy

Após o deploy, verifique:

- [ ] Site está acessível: `https://site-etpc.vercel.app`
- [ ] Página de cursos funciona: `/cursos-online`
- [ ] Checkout funciona: `/checkout`

### 3. Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em sua aplicação > Webhooks
3. Adicione a URL da Vercel:
   ```
   https://site-etpc.vercel.app/api/webhooks/mercadopago
   ```
4. Marque os eventos:
   - ✅ `payment` (Pagamentos)
   - ❌ ~~Order~~ (não marque)

### 4. Testar Integração

#### Teste 1: Verificar se API responde
```bash
curl https://site-etpc.vercel.app/api/webhooks/mercadopago
# Deve retornar { ok: true }
```

#### Teste 2: Criar pagamento de teste
1. Acesse: `https://site-etpc.vercel.app/cursos-online`
2. Adicione curso ao carrinho
3. Vá para checkout
4. Preencha dados do cliente
5. Selecione método de pagamento

**Cartão de Teste:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Validade: Qualquer data futura
- Nome: Qualquer nome

#### Teste 3: Verificar webhook
1. Após criar pagamento
2. Webhook deve ser acionado automaticamente
3. Ver logs na Vercel:
   ```bash
   vercel logs
   ```

---

## 🐛 Troubleshooting

### Problema: Webhook não funciona

**Verifique:**
```bash
# 1. Endpoint está acessível?
curl https://site-etpc.vercel.app/api/webhooks/mercadopago

# 2. Ver logs na Vercel
vercel logs

# 3. Verificar variáveis de ambiente
vercel env ls
```

### Problema: Erro de credenciais

**Solução:**
```bash
# Verificar se token está correto na Vercel
vercel env ls

# Se não estiver, adicione:
vercel env add MERCADOPAGO_ACCESS_TOKEN
# Cole seu token quando solicitado
```

### Problema: Erro de banco de dados

**Solução:**
```bash
# Garantir que DATABASE_URL está configurada
vercel env ls | grep DATABASE_URL

# Se não estiver:
vercel env add DATABASE_URL
# Cole sua string de conexão
```

---

## ✅ Checklist Final

Antes de considerar 100% pronto:

- [ ] Deploy feito na Vercel
- [ ] Site está acessível publicamente
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] Credenciais configuradas na Vercel
- [ ] Banco de dados acessível via Vercel
- [ ] Teste de criação de pagamento funcionando
- [ ] Webhook sendo recebido corretamente
- [ ] Status atualizando no banco de dados

---

## 🎯 Para Produção

Quando estiver testando em produção:

1. **Troque para credenciais de produção**
   ```env
   # .env da Vercel - Configurações > Environment Variables
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx (não TEST-xxxxx)
   ```

2. **Configure webhook de produção**
   - Use URL final: `https://site-etpc.vercel.app/api/webhooks/mercadopago`

3. **Teste com pequenos valores primeiro**
   - Faça transações de R$ 1,00 para garantir que está tudo OK

4. **Monitore os primeiros pagamentos**
   ```bash
   vercel logs --follow
   ```

---

## 📞 Suporte

Se algo der errado:

1. **Logs da Vercel:**
   ```bash
   vercel logs
   ```

2. **Painel Mercado Pago:**
   - Ver transações: https://www.mercadopago.com.br/activities/payments
   - Ver webhooks: https://www.mercadopago.com.br/developers/panel

3. **Banco de Dados:**
   ```bash
   npx prisma studio
   # Verificar tabelas: payments, orders, order_items
   ```

---

**🎉 Tudo pronto! Pode fazer deploy agora!**

