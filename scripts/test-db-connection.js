const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');

    // Count online courses
    const courseCount = await prisma.onlineCourse.count();
    console.log(`✓ Found ${courseCount} online courses in database`);

    // Fetch all courses
    const courses = await prisma.onlineCourse.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        active: true,
        featured: true,
      }
    });

    console.log('\nCourses in database:');
    courses.forEach(course => {
      console.log(`  - ${course.title} (${course.slug}) [active: ${course.active}, featured: ${course.featured}]`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
