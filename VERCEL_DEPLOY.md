# 🚀 Deploy na Vercel - Configuração Completa

## 📋 Variáveis de Ambiente Necessárias

Configure estas variáveis no painel da Vercel:

### 1. Banco de Dados MySQL
```env
DATABASE_URL="mysql://usuario:senha@host:porta/nome_do_banco"
```

### 2. Mercado Pago (OBRIGATÓRIO)
```env
MERCADOPAGO_ACCESS_TOKEN="seu_access_token"
```

**Como obter:**
1. Acesse [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Faça login na sua conta
3. Vá em "Suas integrações" → "Criar aplicação"
4. Copie o **Access Token** (Test ou Production)

### 3. Email (Opcional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
SITE_NAME=ETPC
```

**Para Gmail:**
- Crie uma "Senha de App" em [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Use essa senha no `SMTP_PASS`

### 4. NextAuth
```env
NEXTAUTH_URL=https://seu-site.vercel.app
NEXTAUTH_SECRET="sua_chave_secreta"
```

Para gerar `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. URL Base (Opcional)
```env
NEXT_PUBLIC_BASE_URL=https://seu-site.vercel.app
```

---

## 🔗 Configurar Webhook do Mercado Pago

1. Acesse [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Vá em "Configurações" → "Webhooks"
3. Adicione a URL:
   ```
   https://seu-site.vercel.app/api/webhooks/mercadopago
   ```
4. Escolha os eventos:
   - ✅ Payment
   - ✅ Payment.updated

---

## 📝 Passo a Passo no Vercel

1. **Conectar Repositório**
   - Vá em [vercel.com](https://vercel.com)
   - Clique em "Import Project"
   - Conecte seu repositório GitHub/GitLab

2. **Configurar Variáveis**
   - Vá em "Settings" → "Environment Variables"
   - Adicione TODAS as variáveis listadas acima
   - **Importante:** Marque para "Production", "Preview" e "Development"

3. **Build Settings**
   - Framework Preset: Next.js (detecta automaticamente)
   - Build Command: `npm run build` (padrão)
   - Install Command: `npm install` (padrão)
   - Output Directory: `.next` (padrão)

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar (2-5 minutos)

---

## ✅ Checklist Antes do Deploy

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurado
- [ ] `DATABASE_URL` configurado e testado
- [ ] Webhook configurado no Mercado Pago
- [ ] Credenciais SMTP configuradas (se quiser emails)
- [ ] `NEXTAUTH_URL` aponta para o domínio correto
- [ ] `NEXTAUTH_SECRET` gerado e configurado

---

## 🧪 Testar Após Deploy

1. **Testar PIX:**
   - Acesse https://seu-site.vercel.app/cursos-online
   - Adicione um curso ao carrinho
   - Escolha "PIX" como método de pagamento
   - Verifique se o QR Code aparece

2. **Testar Cartão:**
   - No ambiente de sandbox, use os cards de teste:
     - Número: `5031 4332 1540 6351`
     - CVV: `123`
     - Data: Qualquer data futura (ex: `11/25`)
     - Nome: Qualquer nome

3. **Verificar Webhook:**
   - Faça um pagamento teste
   - Vá em "Webhooks" no Mercado Pago
   - Verifique se há notificações recebidas

---

## 🐛 Troubleshooting

### Erro: "MERCADOPAGO_ACCESS_TOKEN não configurado"
**Solução:** Configure a variável na Vercel e faça redeploy.

### QR Code PIX não aparece
**Solução:** Verifique se o token é válido e se está com permissão para pagamentos.

### Email não é enviado
**Solução:** Verifique SMTP credentials. Os logs aparecem no console da Vercel.

### Webhook não funciona
**Solução:** Verifique a URL no Mercado Pago e se o deploy foi bem-sucedido.

---

## 📞 Suporte

Se algo não funcionar:
1. Verifique os logs da Vercel: Settings → Logs
2. Verifique os logs do Mercado Pago
3. Confirme que todas as variáveis estão configuradas
