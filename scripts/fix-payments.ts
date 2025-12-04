import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPaymentsTable() {
  console.log('🔧 Corrigindo estrutura da tabela payments...');

  try {
    // Lista de comandos SQL para executar
    const queries = [
      // Verificar se as colunas antigas existem
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'etpc' AND TABLE_NAME = 'payments' AND COLUMN_NAME IN ('pagseguroOrderId', 'pagseguroChargeId')",
      
      // Remove colunas antigas se existirem
      "ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroOrderId`",
      "ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroChargeId`",
      
      // Verificar se as novas colunas já existem
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'etpc' AND TABLE_NAME = 'payments' AND COLUMN_NAME IN ('mercadoPagoPaymentId', 'mercadoPagoPreferenceId')",
      
      // Adicionar novas colunas se não existirem
      "ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPaymentId` VARCHAR(255) UNIQUE",
      "ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPreferenceId` VARCHAR(255)"
    ];

    console.log('⚠️  Este script vai alterar a estrutura da tabela payments');
    console.log('⚠️  Certifique-se de ter um backup antes de continuar');
    
    // Como não podemos executar SQL direto no Prisma, vamos usar db push
    console.log('\n📝 Execute manualmente no seu cliente MySQL:');
    console.log('\n1. Conecte ao banco:');
    console.log('   mysql -h 92.118.58.75 -u seu_usuario -p etpc');
    console.log('\n2. Execute os comandos:');
    console.log('\n   ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroOrderId`;');
    console.log('   ALTER TABLE `etpc`.`payments` DROP COLUMN IF EXISTS `pagseguroChargeId`;');
    console.log('   ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPaymentId` VARCHAR(255) UNIQUE;');
    console.log('   ALTER TABLE `etpc`.`payments` ADD COLUMN `mercadoPagoPreferenceId` VARCHAR(255);');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPaymentsTable();

