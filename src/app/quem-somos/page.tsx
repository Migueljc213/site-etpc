'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBullseye, FaBuilding, FaChalkboardTeacher, FaHandshake, FaStar, FaLightbulb } from 'react-icons/fa';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';

export default function QuemSomos() {

  const values = [
    {
      icon: FaBullseye,
      title: 'Excelência Acadêmica',
      description: 'Compromisso com a qualidade do ensino e formação integral dos estudantes.'
    },
    {
      icon: FaHandshake,
      title: 'Inovação',
      description: 'Busca constante por metodologias modernas e tecnologias educacionais.'
    },
    {
      icon: FaStar,
      title: 'Responsabilidade Social',
      description: 'Contribuição para o desenvolvimento da comunidade através da educação.'
    },
    {
      icon: FaLightbulb,
      title: 'Formação Integral',
      description: 'Desenvolvimento de competências técnicas e humanas para o mercado de trabalho.'
    }
  ];

  const team = [
    {
      name: 'Direção Pedagógica',
      role: 'Liderança Educacional',
      description: 'Experiência em gestão educacional e desenvolvimento de projetos pedagógicos inovadores.'
    },
    {
      name: 'Corpo Docente',
      role: 'Professores Especialistas',
      description: 'Profissionais qualificados e atuantes no mercado, trazendo experiência prática para a sala de aula.'
    },
    {
      name: 'Coordenação Técnica',
      role: 'Especialistas em Educação Técnica',
      description: 'Equipe dedicada ao desenvolvimento e atualização dos currículos técnicos.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/quem-somos" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-etpc-blue-dark via-etpc-blue to-etpc-blue-light">
        <div className="absolute top-20 left-10 w-72 h-72 bg-etpc-blue/30 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-etpc-gold/20 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Quem Somos
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            A ETPC é uma instituição de ensino técnico de excelência, comprometida com a formação de profissionais qualificados para o mercado de trabalho.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A ETPC (Escola Técnica da Fundação CSN) é uma instituição de ensino técnico que faz parte da Fundação CSN, 
                uma das principais fundações empresariais do Brasil. Nossa missão é formar profissionais técnicos qualificados 
                para atender às demandas do mercado de trabalho.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Com uma metodologia inovadora que combina teoria e prática, oferecemos cursos técnicos que preparam 
                nossos alunos tanto para o mercado de trabalho quanto para o ingresso no ensino superior.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-etpc-blue/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-etpc-blue-dark mb-2">Nossa Missão</h3>
                  <p className="text-etpc-blue-dark">
                    Formar profissionais técnicos competentes e cidadãos conscientes, contribuindo para o desenvolvimento social e econômico.
                  </p>
                </div>
                <div className="bg-etpc-gold/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-etpc-gold-dark mb-2">Nossa Visão</h3>
                  <p className="text-etpc-gold-dark">
                    Ser reconhecida como referência em educação técnica profissional, inovação e responsabilidade social.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-etpc-blue to-etpc-gold rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-6 text-etpc-blue">
                    <FaBuilding />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Fundação CSN</h3>
                  <p className="text-white/90 leading-relaxed">
                    A ETPC é mantida pela Fundação CSN, uma das principais fundações empresariais do Brasil, 
                    com mais de 50 anos de experiência em educação e responsabilidade social.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os valores que norteiam nossa instituição e orientam nossa prática educacional
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-etpc-blue rounded-full flex items-center justify-center">
                    <value.icon className="text-2xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais qualificados e comprometidos com a excelência educacional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-etpc-blue/5 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-etpc-blue to-etpc-gold rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    <FaChalkboardTeacher className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-etpc-blue font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Números que Compõem Nossa História</h2>
            <p className="text-xl text-white/90">
              Resultados que demonstram nosso compromisso com a excelência educacional
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Alunos Formados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-white/80">Empregabilidade</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-white/80">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Professores Especialistas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Faça Parte da Nossa História</h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a nós e transforme seu futuro profissional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/matriculas" className="bg-gradient-to-r from-etpc-blue to-etpc-gold text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-etpc-blue-dark hover:to-etpc-gold-dark transition-all transform hover:scale-105 shadow-xl">
              Fazer Matrícula
            </Link>
            <Link href="/cursos-tecnicos" className="bg-white text-etpc-blue px-8 py-4 rounded-full text-lg font-semibold border-2 border-etpc-blue hover:bg-etpc-blue/5 transition-all">
              Ver Cursos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
