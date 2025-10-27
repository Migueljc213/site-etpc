# 🔧 Como Corrigir a Tabela de Pagamentos

## Problema
A tabela `payments` no banco de dados ainda tem as colunas antigas do PagSeguro, mas o código espera as novas do Mercado Pago.

## Solução

### Opção 1: Via MySQL Workbench / phpMyAdmin

1. Acesse o painel do banco
2. Execute estes comandos SQL:

```sql
-- Remover colunas antigas
ALTER TABLE `etpc`.`payments` 
  DROP COLUMN IF EXISTS `pagseguroOrderId`;

ALTER TABLE `etpc`.`payments` 
  DROP COLUMN IF EXISTS `pagseguroChargeId`;

-- Adicionar novas colunas
ALTER TABLE `etpc`.`payments` 
  ADD COLUMN `mercadoPagoPaymentId` VARCHAR(255) UNIQUE AFTER `orderId`;

ALTER TABLE `etpc`.`payments` 
  ADD COLUMN `mercadoPagoPreferenceId` VARCHAR(255) AFTER `mercadoPagoPaymentId`;
```

### Opção 2: Via Linha de Comando MySQL

```bash
mysql -h 92.118.58.75 -u SEU_USUARIO -p etpc
```

Depois execute:

```sql
ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroOrderId`;
ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroChargeId`;
ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPaymentId` VARCHAR(255) UNIQUE;
ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPreferenceId` VARCHAR(255);
```

### Opção 3: Via Prisma Studio

1. Abra o Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Clique em "Database Schema" 
3. Vá para a tabela `payments`
4. Execute os comandos SQL manualmente

## ⚠️ Importante

- **Faça backup antes!**
- Teste em desenvolvimento primeiro
- Só execute em produção se tiver certeza

## Após Executar

1. Regenerar Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Reiniciar o servidor:
   ```bash
   npm run dev
   ```

3. Testar criação de pagamento PIX

