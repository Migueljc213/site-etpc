const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Atualizando banners com imagens corretas...');

  // Limpar banners existentes
  await prisma.banner.deleteMany({});

  // Criar banners com URLs válidas
  const banners = await prisma.banner.createMany({
    data: [
      {
        title: 'Transforme seu Futuro com Educação Técnica',
        description: 'Cursos técnicos com alta empregabilidade e conexão direta com o mercado de trabalho.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop&crop=center',
        position: 'homepage-carousel',
        order: 1,
        active: true
      },
      {
        title: 'Automação Industrial - O Futuro é Agora',
        description: 'Forme-se na área mais promissora da indústria 4.0 com nosso curso técnico.',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&h=400&fit=crop&crop=center',
        position: 'homepage-carousel',
        order: 2,
        active: true
      },
      {
        title: 'Desenvolvimento de Sistemas - Crie o Amanhã',
        description: 'Aprenda as tecnologias mais modernas e entre no mercado de TI com confiança.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=400&fit=crop&crop=center',
        position: 'homepage-carousel',
        order: 3,
        active: true
      },
      {
        title: 'Matrículas Abertas 2024',
        description: 'Garanta sua vaga nos melhores cursos técnicos da região. Inscreva-se já!',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop&crop=center',
        position: 'homepage-carousel',
        order: 4,
        active: true
      }
    ]
  });

  console.log(`Atualizados ${banners.count} banners com URLs válidas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
