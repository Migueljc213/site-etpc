import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixEnrollments() {
  try {
    console.log('🔍 Buscando pagamentos aprovados sem matrículas...\n');

    // Buscar todos os pagamentos com status 'paid'
    const paidPayments = await prisma.payment.findMany({
      where: {
        status: 'paid'
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    console.log(`✅ Encontrados ${paidPayments.length} pagamentos aprovados\n`);

    let fixed = 0;
    let alreadyExists = 0;
    let errors = 0;

    for (const payment of paidPayments) {
      const order = payment.order;
      
      console.log(`📦 Processando pedido ${order.orderNumber}`);
      console.log(`   Email: ${order.customerEmail}`);
      console.log(`   Status: ${order.status} | Payment Status: ${order.paymentStatus}`);
      console.log(`   Itens: ${order.items.length}`);

      if (!order.items || order.items.length === 0) {
        console.log(`   ⚠️  Sem itens, pulando...\n`);
        continue;
      }

      for (const item of order.items) {
        if (!item.course) {
          console.log(`   ⚠️  Item sem curso vinculado, pulando...`);
          continue;
        }

        console.log(`   📚 Curso: ${item.course.title}`);

        // Verificar se matrícula já existe
        const existingEnrollment = await prisma.studentEnrollment.findUnique({
          where: {
            studentEmail_courseId: {
              studentEmail: order.customerEmail,
              courseId: item.course.id
            }
          }
        });

        if (existingEnrollment) {
          console.log(`   ✓  Matrícula já existe (Status: ${existingEnrollment.status})`);
          alreadyExists++;
          continue;
        }

        try {
          // Criar matrícula
          const enrolledAt = new Date();
          const expiresAt = new Date(enrolledAt);
          expiresAt.setDate(expiresAt.getDate() + (item.course.validityDays || 365));

          const enrollment = await prisma.studentEnrollment.create({
            data: {
              studentEmail: order.customerEmail,
              courseId: item.course.id,
              status: 'active',
              enrolledAt,
              expiresAt
            }
          });

          console.log(`   ✅ MATRÍCULA CRIADA!`);
          console.log(`      ID: ${enrollment.id}`);
          console.log(`      Expira em: ${expiresAt.toLocaleDateString('pt-BR')}`);
          fixed++;
        } catch (error: any) {
          console.log(`   ❌ ERRO ao criar matrícula: ${error.message}`);
          errors++;
        }
      }

      console.log(''); // linha em branco
    }

    console.log('\n📊 RESUMO:');
    console.log(`   ✅ Matrículas criadas: ${fixed}`);
    console.log(`   ℹ️  Já existentes: ${alreadyExists}`);
    console.log(`   ❌ Erros: ${errors}`);
    console.log(`   📦 Total de pagamentos processados: ${paidPayments.length}`);

    if (fixed > 0) {
      console.log('\n🎉 Problema resolvido! As matrículas foram criadas com sucesso.');
      console.log('   Os alunos já podem acessar seus cursos em /dashboard');
    } else if (alreadyExists > 0) {
      console.log('\n✅ Tudo certo! Todas as matrículas já existem.');
    }

  } catch (error) {
    console.error('❌ Erro fatal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar script
fixEnrollments()
  .then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });

