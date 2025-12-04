'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { FaTools, FaShieldAlt, FaClock, FaBriefcase, FaChartBar, FaUserTie, FaCalendarAlt, FaChartLine, FaMoneyBillWave, FaBullseye, FaChalkboardTeacher, FaBook, FaDesktop, FaWrench, FaTrophy, FaFlask, FaIndustry, FaBolt, FaChevronDown } from 'react-icons/fa';

export default function CursosTecnicos() {


  const courses = [
    {
      id: 'automacao-industrial',
      title: 'Automação Industrial',
      icon: FaIndustry,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '96%',
      salary: 'R$ 3.500 - R$ 8.500',
      description: 'Forme-se como Técnico em Automação Industrial, essencial para o mercado atual e futuro das empresas. Desenvolva conhecimentos em sistemas elétricos, eletrônicos e de automação.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Circuitos Hidropneumáticos', 'Mecânica Básica e impressão 3D', 'Eletrotécnica', 'Eletrônica Digital']
        },
        {
          title: 'Módulo 2', 
          subjects: ['Gestão da Manutenção', 'Máquinas e Equipamentos Elétricos Industriais', 'Automação e Indústria 4.0', 'Robótica Industrial']
        },
        {
          title: 'Módulo 3',
          subjects: ['Projeto', 'Automação e Indústria 4.0', 'Sistemas de Supervisão, redes e Instrumentação Industrial', 'Eletrônica Industrial']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Automação Industrial', 'Técnico em Robótica', 'Técnico em Manutenção Industrial', 'Operador de CLP', 'Técnico em Instrumentação', 'Supervisor de Produção'],
      labs: ['Laboratório de Automação Industrial', 'Lab de Robótica', 'Lab de Eletrônica Industrial', 'Lab de Pneumática e Hidráulica'],
      monthlyValue: 'R$ 504,00',
      color: 'from-etpc-blue to-cyan-600',
      bgColor: 'from-etpc-blue/5 to-cyan-50'
    },
    {
      id: 'eletromecanica',
      title: 'Eletromecânica',
      icon: FaBolt,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '94%',
      salary: 'R$ 3.200 - R$ 7.800',
      description: 'Especialize-se em Eletromecânica com foco em automação e tecnologia industrial. Curso técnico subsequente que prepara para o mercado de trabalho atual.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Circuitos Hidropneumáticos', 'Mecânica Básica e impressão 3D', 'Eletrotécnica', 'Eletrônica Digital', 'Laboratório de Eletrônica']
        },
        {
          title: 'Módulo 2',
          subjects: ['Gestão da Manutenção', 'Máquinas e Equipamentos Elétricos Industriais', 'Automação e Indústria 4.0', 'Robótica Industrial', 'Laboratório de Microcontroladores/Robótica', 'Eletrônica Linear', 'Microcontroladores']
        },
        {
          title: 'Módulo 3',
          subjects: ['Projeto', 'Automação e Indústria 4.0', 'Sistemas de Supervisão, redes e Instrumentação Industrial', 'Eletrônica Industrial']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Eletromecânica', 'Auxiliar de Eletrônica', 'Auxiliar de Automação', 'Técnico em Automação', 'Técnico em Manutenção', 'Técnico em Eletrotécnica'],
      labs: ['Laboratório de Eletrônica', 'Lab de Microcontroladores', 'Lab de Robótica', 'Lab de Eletrotécnica'],
      titulation: [
        '1º Módulo: Auxiliar de Eletrônica',
        '2º Módulo: Auxiliar de Automação', 
        '3º Módulo: Técnico de Automação'
      ],
      monthlyValue: 'R$ 504,00',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      id: 'informatica',
      title: 'Informática',
      icon: FaDesktop,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '98%',
      salary: 'R$ 3.800 - R$ 9.000',
      description: 'Forme-se em Informática com conhecimentos sólidos em programação, desenvolvimento de sistemas e gestão de tecnologia da informação.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Lógica de Programação', 'Algoritmos e Estruturas de Dados', 'Programação Web (HTML, CSS, JavaScript)', 'Banco de Dados']
        },
        {
          title: 'Módulo 2',
          subjects: ['Desenvolvimento de Aplicações', 'Programação Orientada a Objetos', 'Desenvolvimento Mobile', 'Gestão de Projetos']
        },
        {
          title: 'Módulo 3',
          subjects: ['Desenvolvimento de Sistemas', 'Segurança da Informação', 'Projeto Final', 'Estágio Supervisionado']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Informática', 'Desenvolvedor de Software', 'Analista de Sistemas', 'Suporte Técnico', 'Administrador de Sistemas', 'Programador'],
      labs: ['Laboratório de Programação', 'Lab de Desenvolvimento', 'Lab de Redes', 'Lab de Hardware'],
      monthlyValue: 'R$ 504,00',
      color: 'from-green-500 to-teal-600',
      bgColor: 'from-green-50 to-teal-50'
    },
    {
      id: 'mecanica',
      title: 'Mecânica',
      icon: FaWrench,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '92%',
      salary: 'R$ 3.000 - R$ 7.200',
      description: 'Especialize-se em Mecânica Industrial com foco em manutenção, processos de fabricação e tecnologia mecânica moderna.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Desenho Técnico Mecânico', 'Metrologia', 'Materiais e Processos', 'Máquinas e Ferramentas']
        },
        {
          title: 'Módulo 2',
          subjects: ['Processos de Fabricação', 'Manutenção Industrial', 'Automação Mecânica', 'CNC e CAD/CAM']
        },
        {
          title: 'Módulo 3',
          subjects: ['Gestão da Manutenção', 'Projeto Mecânico', 'Qualidade e Controle', 'Estágio Supervisionado']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Mecânica', 'Técnico em Manutenção', 'Operador de Máquinas CNC', 'Técnico em Processos', 'Técnico em Qualidade', 'Supervisor de Manutenção'],
      labs: ['Laboratório de Mecânica', 'Lab de CNC', 'Lab de Metrologia', 'Oficina Mecânica'],
      monthlyValue: 'R$ 504,00',
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50'
    },
    {
      id: 'metalurgia',
      title: 'Metalurgia',
      icon: FaTools,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '90%',
      salary: 'R$ 3.100 - R$ 7.500',
      description: 'Forme-se em Metalurgia com conhecimentos em processos metalúrgicos, tratamento de metais e tecnologia de materiais.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Fundamentos da Metalurgia', 'Propriedades dos Materiais', 'Processos de Fundição', 'Tratamentos Térmicos']
        },
        {
          title: 'Módulo 2',
          subjects: ['Metalurgia Física', 'Processos de Conformação', 'Soldagem Industrial', 'Controle de Qualidade']
        },
        {
          title: 'Módulo 3',
          subjects: ['Metalurgia de Transformação', 'Gestão de Produção', 'Projeto Final', 'Estágio Supervisionado']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Metalurgia', 'Técnico em Soldagem', 'Técnico em Fundição', 'Técnico em Controle de Qualidade', 'Supervisor de Produção', 'Técnico em Tratamento Térmico'],
      labs: ['Laboratório de Metalurgia', 'Lab de Soldagem', 'Lab de Fundição', 'Lab de Ensaios'],
      monthlyValue: 'R$ 504,00',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'from-gray-50 to-slate-50'
    },
    {
      id: 'seguranca-trabalho',
      title: 'Segurança do Trabalho',
      icon: FaShieldAlt,
      duration: '18 meses',
      period: 'Matutino, Vespertino ou Noturno',
      employability: '95%',
      salary: 'R$ 3.300 - R$ 8.000',
      description: 'Especialize-se em Segurança do Trabalho, uma área em crescimento constante com alta demanda no mercado.',
      modules: [
        {
          title: 'Módulo 1',
          subjects: ['Fundamentos de Segurança do Trabalho', 'Legislação Trabalhista', 'Higiene Ocupacional', 'Ergonomia']
        },
        {
          title: 'Módulo 2',
          subjects: ['Prevenção de Acidentes', 'Gestão de Riscos', 'Equipamentos de Proteção', 'Primeiros Socorros']
        },
        {
          title: 'Módulo 3',
          subjects: ['Sistema de Gestão de Segurança', 'Auditoria e Perícias', 'Projeto Final', 'Estágio Supervisionado']
        }
      ],
      prerequisites: 'Ensino Médio Completo ou cursando o último ano do ensino médio',
      targetAudience: 'Todos que desejam realizar um curso técnico para uma posição melhor profissionalmente ou que buscam entrar em uma empresa',
      opportunities: ['Técnico em Segurança do Trabalho', 'Analista de Riscos', 'Consultor em Segurança', 'Coordenador de Segurança', 'Auditor de Segurança', 'Supervisor de Segurança'],
      labs: ['Laboratório de Segurança', 'Lab de Ergonomia', 'Lab de Primeiros Socorros', 'Sala de Simulações'],
      monthlyValue: 'R$ 504,00',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/cursos-tecnicos" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-etpc-blue/5 via-white to-amber-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-etpc-blue/20 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-etpc-gold/20 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-gray-900 leading-tight mb-6">
            Cursos Técnicos
            <span className="bg-gradient-to-r from-etpc-blue to-etpc-gold bg-clip-text text-transparent"> ETPC</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed font-poppins">
            Formação técnica de excelência que conecta você diretamente ao mercado de trabalho.
            Cursos práticos, atualizados e com alta empregabilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#cursos" className="bg-etpc-blue text-white px-8 py-4 rounded-full text-lg font-poppins font-semibold border-2 border-etpc-blue hover:bg-etpc-blue-dark transition-all">
              Ver Cursos
            </a>
          </div>
        </div>
      </section>

      {/* Course Selection Section */}
      <section className="py-20 bg-gradient-to-br from-etpc-blue-dark via-etpc-blue to-etpc-blue-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">Escolha seu Curso Técnico</h2>
            <div className="w-24 h-1 bg-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/90 font-poppins">
              Cursos técnicos subsequentes com alta empregabilidade
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-etpc-blue-dark px-6 py-4">
              <h3 className="text-xl font-poppins font-bold text-white text-center">Cursos Técnicos Disponíveis</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {courses.map((course) => (
                <div key={course.id} className="group hover:bg-etpc-blue/5 transition-colors">
                  <button
                    onClick={() => {
                      setSelectedCourse(course.id);
                      document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-etpc-blue/5 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl text-etpc-blue">
                        <course.icon />
                      </span>
                      <div>
                        <h4 className="text-lg font-poppins font-semibold text-gray-900 group-hover:text-etpc-blue transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-600 font-poppins">
                          {course.duration} • {course.monthlyValue}/mês
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded font-poppins">
                        {course.employability} empregabilidade
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-etpc-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-gray-900 mb-4">Por que Escolher os Cursos Técnicos do ETPC?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaBullseye,
                title: 'Foco no Mercado',
                description: 'Cursos desenvolvidos com base nas demandas reais do mercado de trabalho',
                stats: '95% empregabilidade média'
              },
              {
                icon: FaIndustry,
                title: 'Parcerias Empresariais',
                description: 'Convênios com mais de 200 empresas para estágios e efetivações',
                stats: '200+ empresas parceiras'
              },
              {
                icon: FaChalkboardTeacher,
                title: 'Professores Especialistas',
                description: 'Corpo docente formado por profissionais atuantes no mercado',
                stats: '100% professores especialistas'
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform text-etpc-blue">
                  <item.icon />
                </div>
                <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-4 font-poppins">{item.description}</p>
                <div className="text-etpc-blue font-poppins font-semibold">{item.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-gray-900 mb-4">Nossos Cursos Técnicos</h2>
            <p className="text-xl text-gray-600 font-poppins">Escolha sua área de especialização</p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {courses.map((course) => (
              <div key={course.id} className={`bg-gradient-to-r ${course.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-2xl transition-all`}>
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mr-3 sm:mr-4 text-etpc-blue">
                        <course.icon />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-bold text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1"><FaClock className="text-xs" /> {course.duration}</span>
                          <span className="flex items-center gap-1"><FaCalendarAlt className="text-xs" /> {course.period}</span>
                          <span className="flex items-center gap-1"><FaChartLine className="text-xs" /> {course.employability} empregabilidade</span>
                          <span className="flex items-center gap-1"><FaMoneyBillWave className="text-xs" /> {course.salary}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-gray-700 mb-6">{course.description}</p>

                    {/* Módulos do Curso */}
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        <FaBook />
                        Módulos do Curso:
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {course.modules.map((module, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <h5 className="font-semibold text-gray-900 mb-3 text-center bg-gray-100 rounded px-3 py-1">{module.title}</h5>
                            <ul className="space-y-2">
                              {module.subjects.map((subject, subjectIdx) => (
                                <li key={subjectIdx} className="flex items-start text-sm text-gray-700">
                                  <svg className="w-3 h-3 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {subject}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pré-requisitos e Público-Alvo */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-etpc-blue/5 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                          <span className="text-blue-600 mr-2">📋</span>
                          Pré-requisito:
                        </h4>
                        <p className="text-gray-700 text-sm">{course.prerequisites}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                          <FaBullseye className="text-green-600 mr-2" />
                          Público-Alvo:
                        </h4>
                        <p className="text-gray-700 text-sm">{course.targetAudience}</p>
                      </div>
                    </div>

                    {/* Titulação (apenas para Eletromecânica) */}
                    {course.titulation && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <FaTrophy className="text-purple-600 mr-2" />
                          Titulação por Módulo:
                        </h4>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {course.titulation.map((title, idx) => (
                              <li key={idx} className="flex items-center text-gray-700">
                                <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {title}
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-600 mt-3 italic">
                            O aluno recebe o título de técnico após a conclusão dos 3 módulos.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Oportunidades */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <FaBriefcase className="text-green-600 mr-2" />
                        Oportunidades de Carreira:
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {course.opportunities.map((opportunity, idx) => (
                          <div key={idx} className="flex items-center text-gray-700 bg-gray-50 rounded px-3 py-2">
                            <svg className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    {/* Informações do Curso */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-center text-lg flex items-center justify-center gap-2">
                        <FaChartBar />
                        Informações do Curso
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="bg-etpc-blue/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FaClock className="text-xs" />
                              Duração:
                            </span>
                            <span className="font-bold text-etpc-blue text-right">{course.duration}</span>
                          </div>
                        </div>
                        
                        <div className="bg-etpc-gold/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              Período:
                            </span>
                            <span className="font-bold text-etpc-gold text-right">{course.period}</span>
                          </div>
                        </div>
                        
                        <div className="bg-etpc-blue/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FaChartLine className="text-xs" />
                              Empregabilidade:
                            </span>
                            <span className="font-bold text-etpc-blue text-right">{course.employability}</span>
                          </div>
                        </div>
                        
                        <div className="bg-etpc-gold/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FaMoneyBillWave className="text-xs" />
                              Salário:
                            </span>
                            <span className="font-bold text-etpc-gold text-right">{course.salary}</span>
                          </div>
                        </div>
                        
                        <div className="bg-etpc-blue/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">💵 Mensalidade:</span>
                            <span className="font-bold text-etpc-blue text-right text-lg">{course.monthlyValue}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Laboratórios */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                        <FaFlask />
                        Laboratórios
                      </h4>
                      <div className="space-y-3">
                        {course.labs.map((lab, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-sm text-gray-700">{lab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link
                      href="/matriculas"
                      className={`w-full bg-gradient-to-r ${course.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center`}
                    >
                      Fazer Matrícula
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Histórias de Sucesso</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Roberto Silva',
                course: 'Desenvolvimento de Software',
                company: 'Google',
                image: FaDesktop,
                story: 'Formei-me no ETPC em 2022 e hoje trabalho como Desenvolvedor Full-stack no Google. A base técnica que recebi foi fundamental para meu sucesso.'
              },
              {
                name: 'Ana Costa',
                course: 'Análise de Dados',
                company: 'Netflix',
                image: FaUserTie,
                story: 'O curso de Análise de Dados mudou minha vida. Hoje sou Data Scientist na Netflix e uso diariamente o que aprendi no ETPC.'
              }
            ].map((story, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                    <story.image className="text-2xl" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">{story.name}</div>
                    <div className="text-indigo-600 font-medium">{story.course}</div>
                    <div className="text-gray-600 text-sm">{story.company}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">&ldquo;{story.story}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-poppins font-bold text-white mb-6">Transforme seu Futuro Profissional</h2>
          <p className="text-xl text-white/90 mb-8 font-poppins">
            Venha conhecer nossa estrutura e metodologia de perto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-etpc-blue px-8 py-4 rounded-full text-lg font-poppins font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Agendar Visita
            </button>
            <Link href="/" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-poppins font-semibold border-2 border-white hover:bg-white hover:text-etpc-blue transition-all transform hover:scale-105">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}