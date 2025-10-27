# 🚀 Deploy na Vercel - Guia Rápido

## ✅ Status: PRONTO PARA DEPLOY

Tudo está pronto! Siga estes passos:

---

## Passo 1: Configurar Variáveis de Ambiente na Vercel

Se ainda não configurou:

### Via CLI:
```bash
# Login na Vercel
vercel login

# Adicionar variáveis
vercel env add MERCADOPAGO_ACCESS_TOKEN production
# Cole seu token quando solicitado

vercel env add DATABASE_URL production
# Cole sua string de conexão MySQL
```

### Via Dashboard:
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione:
   - `MERCADOPAGO_ACCESS_TOKEN` = `TEST-xxxxx` ou `APP_USR-xxxxx`
   - `DATABASE_URL` = `mysql://user:pass@host:port/db`

---

## Passo 2: Fazer Deploy

### Opção A: Deploy via Git (Recomendado)
```bash
# Commit e push
git add .
git commit -m "Deploy with Mercado Pago integration"
git push origin main

# Vercel fará deploy automático
```

### Opção B: Deploy Manual
```bash
# Faça login
vercel login

# Deploy
vercel

# Siga as instruções:
# - Link to existing project? Yes
# - Enter project name: etpc (ou o nome do seu projeto)
# - In which directory? ./
# - Deploy command? npm run build
```

---

## Passo 3: Configurar Webhook no Mercado Pago

1. Anote a URL do seu deploy:
   ```
   https://SEU-PROJETO.vercel.app
   ```

2. Acesse: https://www.mercadopago.com.br/developers/panel

3. Vá em sua aplicação > **Webhooks**

4. Configure:
   - **URL:** `https://SEU-PROJETO.vercel.app/api/webhooks/mercadopago`
   - **Eventos:** Marque apenas `payment`

5. Clique em **Salvar configurações**

---

## Passo 4: Testar

### 1. Verificar se site está no ar
```bash
curl https://SEU-PROJETO.vercel.app
```

### 2. Testar webhook
```bash
curl https://SEU-PROJETO.vercel.app/api/webhooks/mercadopago
# Deve retornar: {"ok":true}
```

### 3. Criar pagamento de teste
1. Acesse: `https://SEU-PROJETO.vercel.app/cursos-online`
2. Adicione curso ao carrinho
3. Vá para checkout
4. Preencha:
   - Nome: João da Silva
   - Email: teste@email.com
   - Telefone: (11) 98765-4321
   - CPF: 12345678909

5. Selecione método de pagamento

6. **Cartão de Teste:**
   - Número: `5031 7557 3453 0604`
   - CVV: `123`
   - Validade: `12/25`
   - Nome: João da Silva

### 4. Verificar logs
```bash
vercel logs --follow
# Ou no dashboard: Settings > Functions > Logs
```

---

## ⚠️ Troubleshooting

### Erro: "MERCADOPAGO_ACCESS_TOKEN não configurado"

**Solução:**
```bash
# Verificar se variável está configurada
vercel env ls

# Se não estiver, adicionar:
vercel env add MERCADOPAGO_ACCESS_TOKEN production
```

### Erro: "Cannot reach database"

**Solução:**
```bash
# Verificar DATABASE_URL
vercel env ls | grep DATABASE_URL

# Adicionar se necessário:
vercel env add DATABASE_URL production
```

### Webhook não funciona

**Verificar:**
1. URL está correta no painel do Mercado Pago?
2. Endpoint existe? Teste: `curl https://SEU-PROJETO.vercel.app/api/webhooks/mercadopago`
3. Ver logs: `vercel logs --follow`

### Migrations do banco não foram aplicadas

**Solução:**
```bash
# Conectar ao banco e rodar migration
npx prisma migrate deploy
```

---

## 📋 Checklist Pós-Deploy

- [ ] Site está no ar
- [ ] Webhook configurado no Mercado Pago
- [ ] Criar pagamento de teste funcionou
- [ ] Webhook foi recebido (ver logs)
- [ ] Status foi atualizado no banco de dados

---

## 🎯 Próximos Passos

1. **Testar em produção:**
   - Faça transações reais pequenas
   - Monitore logs atentamente

2. **Configurar notificações:**
   - Email quando pagamento for aprovado
   - SMS opcional

3. **Monitorar:**
   - Painel do Mercado Pago
   - Logs da Vercel
   - Banco de dados

---

**✅ Tudo pronto! Boa sorte com o deploy! 🚀**

