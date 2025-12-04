const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestStudent() {
  try {
    console.log('🎓 Criando usuário de teste...');

    const testEmail = 'aluno.teste@etpc.com.br';
    const testPassword = 'teste123';

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (existingUser) {
      console.log('⚠️  Usuário já existe, removendo dados antigos...');

      // Remover matrículas antigas
      await prisma.studentEnrollment.deleteMany({
        where: { studentEmail: testEmail }
      });

      // Remover progresso antigo
      await prisma.studentProgress.deleteMany({
        where: { studentEmail: testEmail }
      });

      console.log('✓ Dados antigos removidos');
    }

    // Buscar todos os cursos online
    const courses = await prisma.onlineCourse.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        slug: true,
        validityDays: true
      }
    });

    console.log(`\n📚 Encontrados ${courses.length} cursos online ativos`);

    // Criar matrículas para todos os cursos
    const enrollments = [];
    for (const course of courses) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (course.validityDays || 365));

      const enrollment = await prisma.studentEnrollment.create({
        data: {
          studentEmail: testEmail,
          courseId: course.id,
          status: 'active',
          enrolledAt: new Date(),
          expiresAt: expiresAt
        }
      });

      enrollments.push(enrollment);
      console.log(`  ✓ Matriculado em: ${course.title}`);
    }

    console.log(`\n✅ Usuário de teste criado com sucesso!`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ACESSO DO USUÁRIO DE TESTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${testEmail}`);
    console.log(`Senha:    ${testPassword}`);
    console.log(`Cursos:   ${enrollments.length} cursos matriculados`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Acesse: http://localhost:3000/login');
    console.log('📚 Dashboard: http://localhost:3000/dashboard\n');

    // Listar cursos matriculados
    console.log('📖 Cursos Matriculados:');
    courses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title}`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestStudent();
