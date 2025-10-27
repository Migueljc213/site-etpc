# 🔧 Correção de Problemas na Vercel

## Problema 1: Credenciais TEST do Mercado Pago

**Sintoma:** QR Code é gerado mas não é válido para pagamento real

**Causa:** Você está usando credenciais de teste (`TEST-`) em produção

### Solução:
1. Acesse https://www.mercadopago.com.br/developers/panel/credentials
2. Vá para a aba "Produção" (não "Sandbox")
3. Gere novas credenciais de produção
4. Atualize na Vercel:
   - `MERCADOPAGO_ACCESS_TOKEN` - Use credencial de PRODUÇÃO (sem TEST-)
   - `MERCADOPAGO_PUBLIC_KEY` - Use credencial de PRODUÇÃO (sem TEST-)

## Problema 2: Tabela student_enrollments não existe

**Erro:** `The table 'student_enrollments' does not exist`

**Causa:** Schema Prisma não foi aplicado no banco da Vercel

### Solução:
Execute isso na Vercel via SSH ou adicione no package.json:

```bash
# Em package.json, modifique o build command:
"build": "npx prisma db push && npx prisma generate && next build"
```

OU execute manualmente:

```bash
# Conecte-se ao banco MySQL da Vercel
# Execute este SQL:

CREATE TABLE IF NOT EXISTS `student_enrollments` (
  `id` VARCHAR(255) PRIMARY KEY,
  `studentEmail` VARCHAR(255) NOT NULL,
  `courseId` VARCHAR(255) NOT NULL,
  `enrolledAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(255) NOT NULL DEFAULT 'active',
  `completedAt` DATETIME NULL,
  UNIQUE KEY `studentEmail_courseId` (`studentEmail`, `courseId`),
  KEY `studentEmail` (`studentEmail`),
  KEY `courseId` (`courseId`)
);

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` VARCHAR(255) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `videoUrl` VARCHAR(255),
  `duration` INT NOT NULL DEFAULT 0,
  `order` INT NOT NULL DEFAULT 0,
  `moduleId` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `student_progress` (
  `id` VARCHAR(255) PRIMARY KEY,
  `lessonId` VARCHAR(255) NOT NULL,
  `studentEmail` VARCHAR(255) NOT NULL,
  `watched` BOOLEAN NOT NULL DEFAULT false,
  `watchTime` INT NOT NULL DEFAULT 0,
  `completedAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `lessonId_studentEmail` (`lessonId`, `studentEmail`),
  KEY `studentEmail` (`studentEmail`)
);

ALTER TABLE `course_modules` ADD COLUMN IF NOT EXISTS `description` TEXT;
```

## Problema 3: QR Code inválido

**Sintoma:** "QR code não foi encontrado" ao escanear

**Causa:** Ambiente de TEST + possível problema na estrutura do QR Code

### Solução Temporária:
Remova o prefixo `data:image/png;base64,` do QR Code antes de salvar

```typescript
// Em src/app/api/payments/process/route.ts linha 104
pixQrCode: qrCodeBase64 ? `data:image/png;base64,${qrCodeBase64}` : undefined,
// Mude para:
pixQrCode: qrCodeBase64 ? qrCodeBase64 : undefined,
```

## Checklist para Correção:

- [ ] Trocar credenciais TEST por PRODUÇÃO na Vercel
- [ ] Criar tabelas no banco MySQL
- [ ] Verificar se QR Code não tem prefixo `data:`
- [ ] Testar pagamento PIX novamente

## Ação Imediata:

Execute isso na Vercel:

1. Vá em Settings → Environment Variables
2. Delete `MERCADOPAGO_ACCESS_TOKEN`
3. Adicione novamente com credencial de PRODUÇÃO (sem TEST-)
4. Redeploy a aplicação

