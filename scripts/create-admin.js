const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Criando usuário administrador...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@etpc.com.br' },
      update: {
        password: hashedPassword,
        active: true
      },
      create: {
        email: 'admin@etpc.com.br',
        name: 'Administrador ETPC',
        password: hashedPassword,
        role: 'admin',
        active: true
      }
    });

    console.log('✅ Usuário administrador criado/atualizado:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Ativo: ${admin.active}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

