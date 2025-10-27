import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding online courses...');

  const courses = [
    {
      title: 'Excel Avançado - Dashboards e Análises',
      slug: 'excel-avancado-dashboards',
      description: 'Domine o Excel avançado criando dashboards profissionais e análises complexas. Aprenda Power Query, funções avançadas, tabelas dinâmicas e visualizações de dados.',
      shortDescription: 'Aprenda Excel avançado com dashboards profissionais e análises completas',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      instructor: 'Prof. Carlos Silva',
      price: 299.90,
      discountPrice: 199.90,
      duration: '40 horas',
      level: 'intermediario',
      category: 'produtividade',
      featured: true,
      rating: 4.8,
      totalStudents: 1250,
      whatYouWillLearn: JSON.stringify([
        'Criar dashboards interativos e profissionais',
        'Dominar Power Query e automação de dados',
        'Construir análises complexas com funções avançadas',
        'Trabalhar com tabelas dinâmicas avançadas',
        'Visualizar dados de forma impactante'
      ]),
      requirements: 'Conhecimento básico de Excel'
    },
    {
      title: 'Power BI - Análise de Dados Profissional',
      slug: 'power-bi-analise-dados',
      description: 'Torne-se especialista em Power BI criando relatórios visuais e dashboards interativos. Aprenda DAX, modelagem de dados e visualizações avançadas.',
      shortDescription: 'Domine Power BI para criar relatórios profissionais e interativos',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      instructor: 'Prof. Ana Costa',
      price: 349.90,
      discountPrice: 249.90,
      duration: '60 horas',
      level: 'intermediario',
      category: 'analise',
      featured: true,
      rating: 4.9,
      totalStudents: 890,
      whatYouWillLearn: JSON.stringify([
        'Construir relatórios profissionais com Power BI',
        'Dominar DAX para cálculos avançados',
        'Modelar dados para análises complexas',
        'Criar visualizações interativas e dinâmicas',
        'Publicar e compartilhar relatórios na nuvem'
      ]),
      requirements: 'Conhecimento de Excel'
    },
    {
      title: 'Python para Iniciantes',
      slug: 'python-iniciantes',
      description: 'Aprenda Python do zero! Aprenda lógica de programação, variáveis, funções, estruturas de dados e muito mais. Perfeito para quem está começando.',
      shortDescription: 'Aprenda Python do zero com fundamentos sólidos',
      image: 'https://images.unsplash.com/photo-1526379879527-455f8de91566?w=800',
      instructor: 'Prof. Roberto Santos',
      price: 199.90,
      discountPrice: 149.90,
      duration: '50 horas',
      level: 'iniciante',
      category: 'programacao',
      featured: true,
      rating: 4.7,
      totalStudents: 2100,
      whatYouWillLearn: JSON.stringify([
        'Fundamentos de programação com Python',
        'Variáveis, tipos de dados e operadores',
        'Estruturas condicionais e loops',
        'Funções e módulos',
        'Trabalhar com listas, dicionários e arquivos'
      ]),
      requirements: 'Nenhum pré-requisito'
    },
    {
      title: 'Marketing Digital Completo',
      slug: 'marketing-digital-completo',
      description: 'Domine todas as ferramentas de marketing digital: Google Ads, Facebook Ads, SEO, Email Marketing e muito mais. Torne-se um profissional completo.',
      shortDescription: 'Domine todas as ferramentas de marketing digital',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      instructor: 'Prof. Marina Oliveira',
      price: 449.90,
      discountPrice: 299.90,
      duration: '80 horas',
      level: 'intermediario',
      category: 'marketing',
      featured: true,
      rating: 4.8,
      totalStudents: 1650,
      whatYouWillLearn: JSON.stringify([
        'Criar campanhas no Google Ads e Facebook Ads',
        'Dominar SEO e otimização de sites',
        'Email Marketing e automações',
        'Analytics e métricas de performance',
        'Estratégias de conteúdo e redes sociais'
      ]),
      requirements: 'Conhecimento básico de internet'
    },
    {
      title: 'WordPress Completo - Crie Sites Profissionais',
      slug: 'wordpress-sites-profissionais',
      description: 'Aprenda a criar sites profissionais com WordPress. Design, plugins, SEO, e-commerce e muito mais. Crie sites incríveis sem programação.',
      shortDescription: 'Crie sites profissionais com WordPress sem programar',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      instructor: 'Prof. Lucas Martins',
      price: 249.90,
      discountPrice: 179.90,
      duration: '45 horas',
      level: 'iniciante',
      category: 'webdesign',
      featured: false,
      rating: 4.6,
      totalStudents: 980,
      whatYouWillLearn: JSON.stringify([
        'Instalar e configurar WordPress',
        'Escolher e personalizar temas',
        'Instalar e configurar plugins essenciais',
        'Criar páginas e posts profissionais',
        'Configurar loja virtual WooCommerce'
      ]),
      requirements: 'Nenhum pré-requisito'
    },
    {
      title: 'Java e Spring Boot - Backend Completo',
      slug: 'java-spring-boot-backend',
      description: 'Torne-se um especialista em backend com Java e Spring Boot. API REST, segurança, banco de dados e arquitetura de software.',
      shortDescription: 'Desenvolva APIs REST profissionais com Java e Spring Boot',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      instructor: 'Prof. Paulo Rodrigues',
      price: 499.90,
      discountPrice: 349.90,
      duration: '100 horas',
      level: 'avancado',
      category: 'programacao',
      featured: true,
      rating: 4.9,
      totalStudents: 720,
      whatYouWillLearn: JSON.stringify([
        'Dominar Java e Spring Boot framework',
        'Criar APIs RESTful profissionais',
        'Integrar com bancos de dados (JPA/Hibernate)',
        'Implementar segurança com Spring Security',
        'Testar e documentar APIs'
      ]),
      requirements: 'Conhecimento básico de programação'
    }
  ];

  for (const course of courses) {
    await prisma.onlineCourse.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
    console.log(`✅ Curso criado: ${course.title}`);
  }

  console.log('🎉 Cursos criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

