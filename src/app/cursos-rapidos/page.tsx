'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaPhone, FaEnvelope, FaGraduationCap, FaWrench, FaShieldAlt, FaCog, FaChartBar, FaTools, FaIndustry, FaBolt, FaRocket, FaCheck, FaArrowRight } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function CursosRapidosPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const cursos = [
    {
      id: 0,
      title: 'Usinagem-Torno - Módulo Básico',
      description: 'O curso tem como objetivo qualificar profissionais para área de torneira mecânica, capacitando os profissionais na criação e reparo de peças mecânicas em gerais.',
      prerequisites: 'Ter concluído ensino fundamenta II.',
      targetAudience: 'Profissionais que desejem se profissionalizar na área de tornearia mecânica.',
      content: [
        'Noção de Metrologia mecânica',
        'Noção de Desenho técnico',
        'Materiais e ferramentas',
        'Segurança (NR12)',
        'Usinagem de peças',
        'Afiação de brocas e ferramentas'
      ],
      duration: '50 horas',
      icon: FaWrench,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 1,
      title: 'CLP - Controlador Lógico Programável - Básico',
      description: 'O curso tem como objetivo qualificar os profissionais a aprender sobre lógica de programação, automatização de processos.',
      prerequisites: 'Ter concluído ensino médio, conhecimento básico em eletricidade.',
      targetAudience: 'Profissionais que desejem se profissionalizar na área de automação industrial e pessoas da comunidade que busquem uma qualificação profissional.',
      content: [
        'Introdução a Automação',
        'Tipos de PLC',
        'Expansões, Cartões ou Módulos',
        'Introdução a Programação',
        'Sequência, Software e Linguagem de Programação',
        'Portas e Protocolos de Comunicação',
        'Programação de PLC (Siemens)'
      ],
      duration: '40 horas',
      icon: FaCog,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 2,
      title: 'Eletricista de manutenção industrial',
      description: 'O curso tem como objetivo qualificar profissionais da área da indústria, com capacidade para atuar na operação, manutenção e instalação de máquinas e equipamentos elétricos.',
      prerequisites: 'Ter concluído ensino fundamental Il.',
      targetAudience: 'Profissionais que desejem se profissionalizar na área de manutenção elétrica e pessoas da comunidade que busquem uma qualificação profissional.',
      content: [
        'Eletricidade Básica',
        'Máquinas Elétricas',
        'Instalações Elétricas',
        'Metrologia Elétrica',
        'Segurança Aplicada a Eletricidade',
        'Gestão da Manutenção'
      ],
      duration: '280 horas',
      icon: FaBolt,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 3,
      title: 'Instrumentação Industrial',
      description: 'O curso tem como objetivo qualificar profissionais da área da indústria, com capacidade para atuar na operação, manutenção, calibração e instalação de instrumentos de medição de processos.',
      prerequisites: 'Ter concluído ensino fundamental II.',
      targetAudience: 'Profissionais que desejem se profissionalizar na área de Instrumentação e controle de processos e pessoas da comunidade que busquem uma qualificação profissional.',
      content: [
        'Conceito Básico de Instrumentação',
        'Medição de Nível',
        'Medição de Pressão',
        'Medição de Temperatura',
        'Medição de Vazão',
        'Conceitos de Controle'
      ],
      duration: '240 horas',
      icon: FaChartBar,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 4,
      title: 'Manutenção Hidráulica',
      description: 'O curso tem como objetivo qualificar profissionais da área da industrial, com capacidade para atuar na manutenção e instalação de máquinas hidráulicas.',
      prerequisites: 'Ter cursado ensino fundamental.',
      targetAudience: 'Profissionais que desejem aprender sobre manutenção e reparo de equipamentos hidráulicos.',
      content: [
        'Fluidos Hidráulicos',
        'Filtros',
        'Princípios Fundamentais',
        'Válvula de Retenção Simples',
        'Válvula de Retenção com Desbloqueio Hidráulico',
        'Válvulas de Alívio ou Limitadora pressão de Ação Indireta',
        'Válvulas Reguladoras de Vazão com retorno livre',
        'Acumuladores Hidráulicos',
        'Desmontagem de equipamentos',
        'Diagrama com êrro – Manutenção ocasionada',
        'Analise de Falhas em geral'
      ],
      duration: '40 horas',
      icon: FaTools,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 5,
      title: 'Mecânico de Manutenção Industrial',
      description: 'O curso tem como objetivo qualificar profissionais da área da indústria, com capacidade para atuar na operação, manutenção e instalação de máquinas e equipamentos mecânicos.',
      prerequisites: 'Ter concluído ensino fundamental II.',
      targetAudience: 'Profissionais que desejem se profissionalizar na área de manutenção mecânica e pessoas da comunidade que busquem uma qualificação profissional.',
      content: [
        'Desenho Mecânico',
        'Elementos de Máquinas',
        'Lubrificação',
        'Metrologia e Montagem Mecânica',
        'Máquinas Operatrizes',
        'Segurança Aplicada a Mecânica',
        'Gestão da Manutenção'
      ],
      duration: '280 horas',
      icon: FaIndustry,
      color: 'from-gray-500 to-slate-600'
    },
    {
      id: 6,
      title: 'NR 10 Básico',
      description: 'No curso de NR10 básico da ETPC você aprenderá normas e técnicas para garantir a segurança em trabalhos que envolvem eletricidade visando minimizar os riscos das instalações, do meio ambiente e das pessoas envolvidas.',
      prerequisites: 'Ter cursado ensino fundamental.',
      targetAudience: 'Profissionais que tenham a intenção de aperfeiçoar seus currículos e que trabalham ou desejam trabalhar nesta área.',
      content: [
        'Conhecer a Norma Regulamentadora de número 10',
        'Identificar normas, legislações e procedimentos de segurança, de acordo com a atividade',
        'Estabelecer medidas de controle, levando em conta os riscos específicos e adicionais relativos aos trabalhos com eletricidade',
        'Utilizar equipamentos de proteção individual e coletiva, conforme o procedimento de segurança',
        'Realizar procedimentos de proteção e combate a incêndio, de acordo com o risco',
        'Realizar procedimentos de primeiros socorros, considerando o tipo de acidente'
      ],
      duration: '40 horas',
      icon: FaShieldAlt,
      color: 'from-red-600 to-red-700'
    },
    {
      id: 7,
      title: 'NR 33 Supervisor de Entrada',
      description: 'No curso de NR33 Entrantes da ETPC você aprenderá normas e técnicas para garantir a segurança em trabalhos que envolvem espaço confinado, identificando as formas de proteção nestes ambientes.',
      prerequisites: 'Ter cursado ensino fundamental.',
      targetAudience: 'Profissionais que tenham a intenção de aperfeiçoar seus currículos e que trabalham ou desejam trabalhar nesta área.',
      content: [
        'Conhecer a Norma Regulamentadora de número 33',
        'Reconhecer os riscos do trabalho em espaço confinado, identificando as formas de proteção',
        'Identificar normas, legislações e procedimentos de segurança, de acordo com a atividade',
        'Estabelecer medidas de controle, levando em conta os riscos específicos e adicionais relativos aos trabalhos em espaço confinado',
        'Utilizar equipamentos de proteção individual e coletiva, conforme o procedimento de segurança'
      ],
      duration: '40 horas',
      icon: FaShieldAlt,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 8,
      title: 'Curso de treinamento Offshore em ROV (Veículo Operado Remotamente)',
      description: 'Fornecer conhecimentos dentro de uma terminologia e conceitos em robótica submarina; oferecer base técnica e operacional aplicada aos Remotely Operated Vehicles, mais conhecidos como ROVs; princípios de telemetria utilizados na interface do ROV com a superfície, nas embarcações OFFSHORE.',
      prerequisites: 'Ter cursado ensino Técnico.',
      targetAudience: 'Profissionais com nível técnico que desejem ser inseridos na área de petróleo e gás.',
      content: [
        'Introdução a ROV',
        'Manipuladores',
        'Hidráulica do ROV',
        'Laboratório de Hidráulica',
        'Ferramentas auxiliares',
        'Elétrica do Sistema ROV',
        'Laboratório de Comandos Elétricos',
        'Simulador ROV'
      ],
      duration: '60 horas',
      icon: FaRocket,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 9,
      title: 'NR 33 Entrante',
      description: 'No curso de NR33 Entrantes você aprenderá normas e técnicas para garantir a segurança em trabalhos que envolvem espaço confinado bem como reconhecer os riscos do trabalho em espaço confinado, identificando as formas de proteção e ação nestes ambientes.',
      prerequisites: 'Ter cursado ensino fundamental.',
      targetAudience: 'Profissionais que tenham a intenção de aperfeiçoar seus currículos e que trabalham ou desejam trabalhar nesta área.',
      content: [
        'Conhecer a Norma Regulamentadora de número 33',
        'Reconhecer os riscos do trabalho em espaço confinado, identificando as formas de proteção',
        'Identificar normas, legislações e procedimentos de segurança, de acordo com a atividade',
        'Estabelecer medidas de controle, levando em conta os riscos específicos e adicionais relativos aos trabalhos em espaço confinado',
        'Utilizar equipamentos de proteção individual e coletiva, conforme o procedimento de segurança'
      ],
      duration: '16 horas',
      icon: FaShieldAlt,
      color: 'from-orange-600 to-red-700'
    },
    {
      id: 10,
      title: 'NR35',
      description: 'O curso tem como objetivo capacitar o treinando a executar trabalhos em altura, e perceber os riscos inerentes a atividade, identificando os equipamentos necessários e obrigatórios para execução de tarefas. Perigo x Risco – após análise de risco.',
      prerequisites: 'Ter cursado ensino fundamental.',
      targetAudience: 'Profissionais que tenham a intenção de aperfeiçoar seus currículos e que trabalham ou desejam trabalhar nesta área.',
      content: [
        'Conhecer a Norma Regulamentadora de número 35',
        'Reconhecer os riscos do trabalho em altura, identificando as formas de proteção',
        'Identificar normas, legislações e procedimentos de segurança, de acordo com a atividade',
        'Estabelecer medidas de controle, levando em conta os riscos específicos e adicionais relativos aos trabalhos em altura',
        'Utilizar equipamentos de proteção individual e coletiva, conforme o procedimento de segurança'
      ],
      duration: '8 horas',
      icon: FaShieldAlt,
      color: 'from-yellow-600 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="text-etpc-blue font-poppins font-bold text-2xl tracking-wide hover:scale-105 transition-transform cursor-pointer">
                <div className="relative">
                  etpc
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-etpc-blue"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 bg-etpc-blue"></div>
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Home</Link>
              <Link href="/quem-somos" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Quem Somos</Link>
              <Link href="/fundamental2" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Fundamental 2</Link>
              <Link href="/ensinomedio" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Ensino Médio</Link>
              <Link href="/cursos-tecnicos" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Cursos Técnicos</Link>
              <Link href="/cursos-rapidos" className="text-etpc-blue font-poppins font-medium relative">
                Cursos Rápidos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-etpc-blue"></span>
              </Link>
              <Link href="/in-company" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">In Company</Link>
              <Link href="/matriculas" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Matrículas</Link>
              <Link href="/noticias" className="text-gray-700 hover:text-etpc-blue transition-colors font-poppins font-medium">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-poppins font-bold leading-tight">
                Cursos Rápidos
              </h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Ao escolher um curso rápido, o aluno se aprofunda em uma determinada área e pode atuar em empresas de pequeno, médio e grande porte. Estudantes do ensino médio, jovens recém formados e até quem já possui carreira profissional podem fazer um curso técnico rápido para se atualizar rapidamente, aprimorar conhecimentos, ou, então, mudar de área.
                </p>
                <p>
                  Comprometida com a excelência educacional e reconhecida pelo mercado, oferecemos uma formação inovadora, que alia o conhecimento teórico com a prática, tecnologia e infraestrutura. Nosso compromisso é oferecer uma qualificação atualizada com as diretrizes e programas nacionais, mas também adequadas às necessidades locais para contribuir com a empregabilidade dos futuros profissionais em nossa região.
                </p>
                <p>
                  Contamos com um Centro de Treinamento em Segurança com mais de 1.110 m² e 6 espaços para treinamentos com máquinas e equipamentos específicos para realização de aulas práticas e simulações. Por ano, mais de 10 mil profissionais passam pelo nosso Centro de Treinamento.
                </p>
                <div className="flex items-center space-x-4 text-lg">
                  <FaPhone className="text-etpc-gold" />
                  <span>(24) 3340-5412</span>
                  <FaEnvelope className="text-etpc-gold ml-4" />
                  <span>treinamentos@etpc.com.br</span>
                </div>
              </div>
              <div className="pt-4">
                <a 
                  href="#cursos" 
                  className="inline-flex items-center bg-gradient-to-r from-etpc-gold to-etpc-gold-dark text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-etpc-gold-dark hover:to-etpc-gold transition-all transform hover:scale-105 shadow-2xl hover:shadow-etpc-gold/25"
                >
                  Preencha o formulário de interesse
                  <FaArrowRight className="ml-2" />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-etpc-blue/20 to-etpc-gold/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaGraduationCap className="text-6xl text-white/80 mx-auto mb-4" />
                    <p className="text-lg font-medium">Centro de Treinamento</p>
                    <p className="text-sm text-white/70">Mais de 1.110 m² de infraestrutura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Section */}
      <section id="cursos" className="py-20 bg-gradient-to-br from-etpc-gold to-etpc-gold-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {cursos.map((curso) => (
              <div key={curso.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion(curso.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${curso.color} flex items-center justify-center text-white`}>
                      <curso.icon className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{curso.title}</h3>
                  </div>
                  {openAccordion === curso.id ? (
                    <FaChevronUp className="text-etpc-blue text-xl" />
                  ) : (
                    <FaChevronDown className="text-etpc-blue text-xl" />
                  )}
                </button>
                
                {openAccordion === curso.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="pt-6 space-y-6">
                      <p className="text-gray-700 leading-relaxed">{curso.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Pré-requisito:</h4>
                          <p className="text-gray-700">{curso.prerequisites}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Público Alvo:</h4>
                          <p className="text-gray-700">{curso.targetAudience}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Conteúdo:</h4>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {curso.content.map((item, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <FaCheck className="w-4 h-4 text-etpc-gold mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6">
                          <div>
                            <span className="font-semibold text-gray-900">Carga Horária:</span>
                            <span className="ml-2 text-etpc-blue font-bold">{curso.duration}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Para mais informações sobre o valor, entre em contato:</p>
                          <p>(24) 3340-5412 ou treinamentos@etpc.com.br</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
