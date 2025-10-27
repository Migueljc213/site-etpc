-- Script para corrigir tabela de pagamentos
-- Remove colunas antigas do PagSeguro e adiciona novas do Mercado Pago

ALTER TABLE `etpc`.`payments` 
  DROP COLUMN IF EXISTS `pagseguroOrderId`,
  DROP COLUMN IF EXISTS `pagseguroChargeId`;

ALTER TABLE `etpc`.`payments`
  ADD COLUMN IF NOT EXISTS `mercadoPagoPaymentId` VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS `mercadoPagoPreferenceId` VARCHAR(255);
