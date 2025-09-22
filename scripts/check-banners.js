const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  });
  
  console.log('Banners no banco:');
  banners.forEach(banner => {
    console.log(`- ${banner.title}: ${banner.image}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
