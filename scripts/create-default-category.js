const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Criando categoria padrão...');

  // Verificar se já existe
  const existingCategory = await prisma.category.findFirst({
    where: { slug: 'noticias' }
  });

  if (!existingCategory) {
    const category = await prisma.category.create({
      data: {
        name: 'Notícias',
        slug: 'noticias',
        description: 'Categoria padrão para notícias',
        color: '#3B82F6',
        active: true
      }
    });

    console.log(`Categoria criada: ${category.name} (ID: ${category.id})`);
  } else {
    console.log(`Categoria já existe: ${existingCategory.name} (ID: ${existingCategory.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
