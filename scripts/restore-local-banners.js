const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Restaurando banners com imagens locais...');

  // Limpar banners existentes
  await prisma.banner.deleteMany({});

  // Criar banners com imagens locais
  const banners = await prisma.banner.createMany({
    data: [
      {
        title: 'Cursos de curta duração',
        description: 'Capacitação rápida e eficiente',
        image: '/images/banners/banner-1.jpg',
        position: 'homepage-carousel',
        order: 1,
        active: true
      },
      {
        title: 'Estudantes ETPC',
        description: 'Futuro brilhante começa aqui',
        image: '/images/banners/banner-2.jpg',
        position: 'homepage-carousel',
        order: 2,
        active: true
      },
      {
        title: 'Educação Técnica',
        description: 'Preparando profissionais para o mercado',
        image: '/images/banners/banner-3.jpg',
        position: 'homepage-carousel',
        order: 3,
        active: true
      }
    ]
  });

  console.log(`Restaurados ${banners.count} banners com imagens locais.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
