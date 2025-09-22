import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Criar usuário administrador
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@etpc.com.br' },
    update: {},
    create: {
      email: 'admin@etpc.com.br',
      name: 'Administrador ETPC',
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'noticias' },
      update: {},
      create: {
        name: 'Notícias',
        slug: 'noticias',
        description: 'Notícias gerais da ETPC',
        color: '#3B82F6'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'blog' },
      update: {},
      create: {
        name: 'Blog',
        slug: 'blog',
        description: 'Artigos e posts do blog',
        color: '#10B981'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'eventos' },
      update: {},
      create: {
        name: 'Eventos',
        slug: 'eventos',
        description: 'Eventos e atividades da ETPC',
        color: '#F59E0B'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'matriculas' },
      update: {},
      create: {
        name: 'Matrículas',
        slug: 'matriculas',
        description: 'Informações sobre matrículas',
        color: '#EF4444'
      }
    })
  ])

  console.log('✅ Categories created:', categories.length)

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'educacao' },
      update: {},
      create: {
        name: 'Educação',
        slug: 'educacao',
        color: '#3B82F6'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'etpc' },
      update: {},
      create: {
        name: 'ETPC',
        slug: 'etpc',
        color: '#10B981'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'alunos' },
      update: {},
      create: {
        name: 'Alunos',
        slug: 'alunos',
        color: '#F59E0B'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'sucesso' },
      update: {},
      create: {
        name: 'Sucesso',
        slug: 'sucesso',
        color: '#8B5CF6'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'cursos' },
      update: {},
      create: {
        name: 'Cursos',
        slug: 'cursos',
        color: '#EF4444'
      }
    })
  ])

  console.log('✅ Tags created:', tags.length)

  // Criar notícias de exemplo
  const news = await Promise.all([
    prisma.news.upsert({
      where: { slug: 'da-etpc-para-o-phd-no-estados-unidos-conheca-a-historia-de-gabriela-cuconato' },
      update: {},
      create: {
        title: 'Da ETPC para o PHD no Estados Unidos: conheça a história de Gabriela Cuconato',
        slug: 'da-etpc-para-o-phd-no-estados-unidos-conheca-a-historia-de-gabriela-cuconato',
        excerpt: 'Gabriela Cuconato foi aluna da ETPC, escola da Fundação CSN localizada em Volta Redonda (RJ), entre os anos de 2009 e 2011...',
        content: '<p>Gabriela Cuconato foi aluna da ETPC e hoje é PhD em Comportamento Organizacional nos Estados Unidos.</p>',
        author: 'Equipe ETPC',
        featured: true,
        published: true,
        publishedAt: new Date('2024-08-18'),
        categoryId: categories[0].id,
        tags: {
          create: [
            { tagId: tags[0].id }, // Educação
            { tagId: tags[1].id }, // ETPC
            { tagId: tags[2].id }, // Alunos
            { tagId: tags[3].id }  // Sucesso
          ]
        }
      }
    }),
    prisma.news.upsert({
      where: { slug: 'etpc-abre-inscricoes-para-curso-preparatorio-para-concurso-da-petrobras-2023' },
      update: {},
      create: {
        title: 'ETPC abre inscrições para curso preparatório para concurso da Petrobrás 2023!',
        slug: 'etpc-abre-inscricoes-para-curso-preparatorio-para-concurso-da-petrobras-2023',
        excerpt: 'A ETPC abriu as inscrições para curso preparatório para o concurso da Petrobrás de 2023...',
        content: '<p>Conteúdo da notícia sobre o curso preparatório da Petrobrás...</p>',
        author: 'Equipe ETPC',
        featured: false,
        published: true,
        publishedAt: new Date('2024-02-14'),
        categoryId: categories[0].id,
        tags: {
          create: [
            { tagId: tags[4].id } // Cursos
          ]
        }
      }
    })
  ])

  console.log('✅ News created:', news.length)

  // Criar banners do carrossel
  const banners = await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner-1' },
      update: {},
      create: {
        id: 'banner-1',
        title: 'Cursos de curta duração',
        subtitle: 'Capacitação rápida e eficiente',
        description: 'Banner promocional para cursos de curta duração',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=300&fit=crop&crop=center',
        link: '/cursos-tecnicos',
        position: 'homepage-carousel',
        order: 1,
        active: true
      }
    }),
    prisma.banner.upsert({
      where: { id: 'banner-2' },
      update: {},
      create: {
        id: 'banner-2',
        title: 'Estudantes ETPC',
        subtitle: 'Futuro brilhante começa aqui',
        description: 'Banner com estudantes da ETPC',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&h=300&fit=crop&crop=center',
        link: '/quem-somos',
        position: 'homepage-carousel',
        order: 2,
        active: true
      }
    }),
    prisma.banner.upsert({
      where: { id: 'banner-3' },
      update: {},
      create: {
        id: 'banner-3',
        title: 'Educação Técnica',
        subtitle: 'Preparando profissionais para o mercado',
        description: 'Banner da estudante com capacete de segurança',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=300&fit=crop&crop=center',
        link: '/ensinomedio',
        position: 'homepage-carousel',
        order: 3,
        active: true
      }
    })
  ])

  console.log('✅ Banners created:', banners.length)

  // Criar curso de exemplo
  const course = await prisma.course.upsert({
    where: { slug: 'automacao-industrial' },
    update: {},
    create: {
      title: 'Automação Industrial',
      slug: 'automacao-industrial',
      description: 'Forme-se como Técnico em Automação Industrial, essencial para o mercado atual e futuro das empresas.',
      icon: '🏭',
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '96%',
      salary: 'R$ 3.500 - R$ 8.500',
      monthlyValue: 'R$ 504,00',
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      active: true,
      modules: {
        create: [
          {
            title: 'Módulo 1',
            order: 0,
            subjects: {
              create: [
                { name: 'Circuitos Hidropneumáticos', order: 0 },
                { name: 'Mecânica Básica e impressão 3D', order: 1 },
                { name: 'Eletrotécnica', order: 2 },
                { name: 'Eletrônica Digital', order: 3 }
              ]
            }
          },
          {
            title: 'Módulo 2',
            order: 1,
            subjects: {
              create: [
                { name: 'Gestão da Manutenção', order: 0 },
                { name: 'Máquinas e Equipamentos Elétricos Industriais', order: 1 },
                { name: 'Automação e Indústria 4.0', order: 2 },
                { name: 'Robótica Industrial', order: 3 }
              ]
            }
          }
        ]
      },
      opportunities: {
        create: [
          { title: 'Técnico em Automação Industrial' },
          { title: 'Técnico em Robótica' },
          { title: 'Técnico em Manutenção Industrial' }
        ]
      },
      labs: {
        create: [
          { name: 'Laboratório de Automação Industrial' },
          { name: 'Lab de Robótica' },
          { name: 'Lab de Eletrônica Industrial' }
        ]
      }
    }
  })

  console.log('✅ Course created:', course.title)

  // Criar configurações do site
  const configs = await Promise.all([
    prisma.siteConfig.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: 'ETPC - Escola Técnica da Fundação CSN',
        type: 'string',
        description: 'Nome do site'
      }
    }),
    prisma.siteConfig.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: 'Formação técnica de excelência que conecta você diretamente ao mercado de trabalho.',
        type: 'string',
        description: 'Descrição do site'
      }
    }),
    prisma.siteConfig.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: {
        key: 'contact_email',
        value: 'contato@etpc.com.br',
        type: 'string',
        description: 'Email de contato'
      }
    }),
    prisma.siteConfig.upsert({
      where: { key: 'contact_phone' },
      update: {},
      create: {
        key: 'contact_phone',
        value: '(11) 3340-5412',
        type: 'string',
        description: 'Telefone de contato'
      }
    })
  ])

  console.log('✅ Site configs created:', configs.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
