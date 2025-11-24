import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type QuestionSeed = {
  question: string
  options: string[]
  correctIndex: number
}

const defaultQuestionSet: QuestionSeed[] = [
  {
    question: 'Após concluir todas as aulas do módulo, qual é o próximo passo recomendado para o aluno?',
    options: [
      'Realizar a avaliação do módulo para consolidar o aprendizado',
      'Desconsiderar o módulo e avançar para o próximo curso',
      'Aguardar a avaliação sem realizar nenhuma ação',
      'Refazer todas as aulas mesmo que já tenha entendido o conteúdo'
    ],
    correctIndex: 0
  },
  {
    question: 'Qual percentual mínimo de acertos é necessário para aprovação na avaliação?',
    options: ['70% dos pontos', '100% dos pontos', '40% dos pontos', '10% dos pontos'],
    correctIndex: 0
  },
  {
    question: 'Como o aluno registra oficialmente que concluiu o módulo?',
    options: [
      'Marcando as aulas como assistidas e finalizando a avaliação',
      'Enviando um email para o suporte solicitando aprovação',
      'Deslogando da plataforma e aguardando confirmação automática',
      'Criando um novo cadastro na plataforma'
    ],
    correctIndex: 0
  }
]

function buildOptionId(moduleId: string, questionIndex: number, optionIndex: number) {
  return `opt-${moduleId}-${questionIndex}-${optionIndex}`
}

async function ensureModuleExams() {
  const modules = await prisma.courseModule.findMany({
    include: {
      course: true,
      exam: {
        select: { id: true }
      }
    }
  })

  for (const module of modules) {
    if (module.exam) {
      console.log(`ℹ️ Exam already exists for module "${module.title}" (${module.course.title})`)
      continue
    }

    console.log(`📝 Creating exam for module "${module.title}" (${module.course.title})`)

    await prisma.moduleExam.create({
      data: {
        moduleId: module.id,
        title: `Avaliação - ${module.title}`,
        description: 'Prova gerada automaticamente para validar os conhecimentos do módulo.',
        passingScore: 70,
        timeLimit: 30,
        isRequired: true,
        questions: {
          create: defaultQuestionSet.map((question, questionIndex) => {
            const correctOptionId = buildOptionId(module.id, questionIndex, question.correctIndex)

            return {
              question: question.question,
              order: questionIndex,
              type: 'multiple_choice',
              correctAnswer: correctOptionId,
              options: {
                create: question.options.map((optionText, optionIndex) => ({
                  id: buildOptionId(module.id, questionIndex, optionIndex),
                  text: optionText,
                  order: optionIndex
                }))
              }
            }
          })
        }
      }
    })

    console.log(`✅ Exam created for module "${module.title}" (${module.course.title})`)
  }
}

async function ensureCourseRecordForOnlineCourse(onlineCourse: Awaited<ReturnType<typeof prisma.onlineCourse.findMany>>[number]) {
  let course = await prisma.course.findFirst({
    where: { slug: onlineCourse.slug }
  })

  if (course) {
    return course
  }

  const priceNumber = Number(onlineCourse.price ?? 0)
  const priceFormatted = `R$ ${priceNumber.toFixed(2)}`

  course = await prisma.course.create({
    data: {
      title: onlineCourse.title,
      slug: onlineCourse.slug,
      description: onlineCourse.description.substring(0, 500),
      icon: '📚',
      duration: onlineCourse.duration || 'Online',
      period: 'Flexível',
      employability: '100%',
      salary: priceFormatted,
      monthlyValue: priceFormatted,
      prerequisites: onlineCourse.requirements || 'Sem pré-requisitos',
      targetAudience: 'Estudantes interessados em aprender online',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50'
    }
  })

  console.log(`✅ Course record created for online course "${onlineCourse.title}"`)

  return course
}

async function ensureModulesForAllCourses() {
  const courses = await prisma.course.findMany({
    include: { modules: true }
  })

  for (const course of courses) {
    if (course.modules.length > 0) {
      continue
    }

    await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: 'Módulo 1 - Introdução',
        order: 0,
        description: `Conteúdo principal do curso ${course.title}. Este módulo apresenta os fundamentos e conceitos básicos necessários para o aprendizado.`
      }
    })

    console.log(`🧩 Module created for course "${course.title}"`)
  }
}

async function ensureVideosForAllModules() {
  const modules = await prisma.courseModule.findMany({
    include: {
      course: true,
      onlineLessons: true
    }
  })

  // Mapeamento de títulos de vídeo por tipo de curso
  const videoTitles: Record<string, string> = {
    'Automação Industrial': 'Introdução à Automação Industrial',
    'Excel Avançado': 'Introdução ao Excel Avançado',
    'Power BI': 'Introdução ao Power BI',
    'Java': 'Introdução ao Java e Spring Boot',
    'Python': 'Introdução ao Python',
    'JavaScript': 'Introdução ao JavaScript',
    'React': 'Introdução ao React',
    'Node.js': 'Introdução ao Node.js'
  }

  // Função para obter título do vídeo baseado no curso
  const getVideoTitle = (courseTitle: string): string => {
    for (const [key, value] of Object.entries(videoTitles)) {
      if (courseTitle.includes(key)) {
        return value
      }
    }
    return `Introdução ao ${courseTitle}`
  }

  for (const module of modules) {
    if (module.onlineLessons.length > 0) {
      continue
    }

    console.log(`🎥 Creating video for module "${module.title}" (${module.course.title})`)

    const videoTitle = getVideoTitle(module.course.title)

    await prisma.lesson.create({
      data: {
        moduleId: module.id,
        title: `Aula 1 - ${videoTitle}`,
        description: `Primeira aula do módulo "${module.title}" do curso ${module.course.title}. Nesta aula você aprenderá os conceitos fundamentais e será apresentado aos principais tópicos que serão abordados ao longo do curso. Este é um vídeo de exemplo que deve ser substituído pelo conteúdo real do curso.`,
        videoUrl: null, // URL será preenchida quando o vídeo real for adicionado
        duration: 20, // Duração em minutos (exemplo)
        order: 0
      }
    })

    console.log(`✅ Video created for module "${module.title}" (${module.course.title})`)
  }
}

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
            description: 'Fundamentos e bases técnicas do curso de Automação Industrial.',
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
            description: 'Aplicações práticas e tecnologias emergentes em automação.',
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

  // Garantir provas para todos os módulos existentes
  const onlineCourses = await prisma.onlineCourse.findMany()
  if (onlineCourses.length > 0) {
    for (const onlineCourse of onlineCourses) {
      await ensureCourseRecordForOnlineCourse(onlineCourse)
    }
  }

  await ensureModulesForAllCourses()
  await ensureVideosForAllModules()
  await ensureModuleExams()

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
