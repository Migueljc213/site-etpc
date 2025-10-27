# 🧪 Guia: Testando Mercado Pago Localmente

## ❌ O Problema

**Mercado Pago NÃO envia webhooks para localhost!**

```
localhost:3000/api/webhooks/mercadopago ❌ NÃO FUNCIONA
```

## ✅ Soluções

### Opção 1: Vercel (Mais Fácil e Recomendado)

**Vantagens:**
- ✅ URL pública gratuita
- ✅ Deploy automático
- ✅ Perfeito para testes
- ✅ Grátis até certo limite

**Como fazer:**

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Faça login
vercel login

# 3. Faça deploy
vercel

# 4. Siga as instruções e pegue a URL:
# https://seu-projeto.vercel.app
```

**Configurar webhook:**
```
https://seu-projeto.vercel.app/api/webhooks/mercadopago
```

**Testar:**
1. Acesse: `https://seu-projeto.vercel.app/cursos-online`
2. Adicione curso ao carrinho
3. Finalize compra
4. Os webhooks funcionarão normalmente

---

### Opção 2: ngrok (Local com URL Pública)

**Vantagens:**
- ✅ Testa localmente
- ✅ URL pública temporária
- ✅ Bom para debug rápido

**Como fazer:**

1. **Baixe ngrok:**
   - Site: https://ngrok.com
   - Windows: https://ngrok.com/download

2. **Execute:**
   ```bash
   ngrok http 3000
   ```

3. **Copie a URL fornecida:**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

4. **Configure webhook no Mercado Pago:**
   ```
   https://abc123.ngrok.io/api/webhooks/mercadopago
   ```

**Nota:** A URL muda toda vez que você reinicia o ngrok!

---

### Opção 3: Testar SEM Webhook

**Quando usar:**
- Apenas desenvolver funcionalidade
- Testar criação de pagamentos
- Verificar UI/UX

**Como funciona:**
1. Crie pagamentos normalmente
2. Consulte status manualmente no painel do Mercado Pago
3. Webhooks não são necessários nesta fase

**Limitações:**
- ❌ Não recebe atualizações automáticas
- ❌ Precisa consultar status manualmente
- ✅ Mas funcionalidade de criação funciona 100%

---

## 🚀 Fluxo Completo de Teste

### Passo 1: Iniciar Projeto Local

```bash
# Iniciar servidor
npm run dev

# Projeto rodando em: http://localhost:3000
```

### Passo 2: Fazer Deploy (Vercel ou ngrok)

**Opção A - Vercel:**
```bash
vercel
# URL: https://seu-projeto.vercel.app
```

**Opção B - ngrok:**
```bash
ngrok http 3000
# URL: https://abc123.ngrok.io
```

### Passo 3: Configurar Webhook

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em sua aplicação > **Webhooks**
3. Adicione URL (Vercel ou ngrok):
   ```
   https://SUA-URL/api/webhooks/mercadopago
   ```

### Passo 4: Testar

```bash
# 1. Acesse sua URL pública
# 2. Vá em /cursos-online
# 3. Adicione curso ao carrinho
# 4. Finalize compra
# 5. Use cartão de teste: 5031 7557 3453 0604
```

---

## 📋 CheckList de Teste Local

### ✅ Antes de Testar
- [ ] Servidor rodando (`npm run dev`)
- [ ] Deploy na Vercel OU ngrok rodando
- [ ] Credenciais do Mercado Pago no `.env`
- [ ] Webhook configurado no painel
- [ ] Banco de dados acessível

### ✅ Durante Teste
- [ ] Conseguir adicionar curso ao carrinho
- [ ] Preencher dados no checkout
- [ ] Criar pagamento com sucesso
- [ ] Receber resposta (QR Code/Boleto/etc)
- [ ] Ver logs no console do servidor

### ✅ Após Teste
- [ ] Verificar webhook recebido
- [ ] Consultar banco de dados
- [ ] Verificar status no painel Mercado Pago

---

## 🐛 Troubleshooting

### Problema: Webhook não chega

**Verifique:**
```bash
# 1. URL está correta no painel?
# 2. Servidor está acessível publicamente?
# 3. Ver logs:
# Vercel: vercel logs
# Local: console do terminal onde ngrok está rodando
```

### Problema: Erro 404 no webhook

**Verifique:**
```bash
# Endpoint existe?
# Teste manualmente:
curl https://SUA-URL/api/webhooks/mercadopago
```

### Problema: Erro de autenticação

**Verifique:**
```bash
# .env está configurado?
# Access Token está correto?
# Verifique: echo $MERCADOPAGO_ACCESS_TOKEN
```

---

## 💡 Dica Pro

Para desenvolvimento, use **Vercel** porque:
1. É mais estável que ngrok
2. URL não muda a cada restart
3. Integração perfeita com Next.js
4. Deploy é instantâneo
5. Logs são mais fáceis de ver

---

## 📞 Precisa de Ajuda?

- Documentação Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
- Documentação Vercel: https://vercel.com/docs
- Documentação ngrok: https://ngrok.com/docs

