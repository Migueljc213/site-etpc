'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { FaGraduationCap, FaCog, FaClock, FaRocket, FaBullseye, FaBook, FaFlask, FaIndustry, FaBuilding } from 'react-icons/fa';

export default function Matriculas() {
  const [formData, setFormData] = useState({
    responsavel: '',
    email: '',
    telefone: '',
    aluno: '',
    ano: '2024',
    nivel: '',
    mensagem: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Por favor, aceite os termos de uso para continuar.');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const courses = [
    {
      icon: FaGraduationCap,
      title: 'Ensino Médio + Técnico',
      description: 'Formação completa que combina excelência acadêmica com preparação técnica profissional',
      duration: '3 anos',
      target: 'Estudantes do 1º ao 3º ano'
    },
    {
      icon: FaCog,
      title: 'Cursos Técnicos Subsequentes',
      description: 'Para quem já concluiu o ensino médio e quer se especializar em uma área técnica',
      duration: '18 meses',
      target: 'Concluintes do Ensino Médio'
    },
    {
      icon: FaRocket,
      title: 'Cursos Técnicos Rápidos',
      description: 'Capacitação acelerada para profissionais que buscam atualização rápida',
      duration: '6-12 meses',
      target: 'Profissionais ativos'
    },
    {
      icon: FaBook,
      title: 'Cursos Livres',
      description: 'Formações livres em diversas áreas para desenvolvimento pessoal e profissional',
      duration: 'Variável',
      target: 'Público em geral'
    },
    {
      icon: FaBuilding,
      title: 'Capacitação para Empresas',
      description: 'Treinamentos customizados para desenvolver e qualificar equipes corporativas',
      duration: 'Sob demanda',
      target: 'Empresas e organizações'
    }
  ];

  const yearOptions = ['2024', '2025'];
  const levelOptions = [
    '1º ano - Ensino Médio',
    '2º ano - Ensino Médio',
    '3º ano - Ensino Médio',
    'Curso Técnico Subsequente',
    'Curso Técnico Rápido',
    'Curso Livre'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/matriculas" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-etpc-blue-dark via-etpc-blue to-etpc-blue-light">
        <div className="absolute top-20 left-10 w-72 h-72 bg-etpc-gold/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-etpc-blue-light/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-etpc-gold/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Saiba mais
              </h1>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                Nós oferecemos Ensino Médio + Técnico, Cursos Técnicos Subsequentes, Cursos Técnicos Rápidos, Cursos Livres e cursos de capacitação para empresas.
              </p>
              <p className="text-lg text-white/80 mb-8">
                O método adotado é o conhecimento na prática, valorizando experiências em laboratórios, empresas e universidades. São cursos que preparam tanto pra universidade como pro mercado de trabalho.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#formulario" className="bg-white text-etpc-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-etpc-blue/5 transition-all transform hover:scale-105 shadow-xl">
                  Fazer Matrícula
                </a>
                <a href="#cursos" className="bg-etpc-blue text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-etpc-blue-dark transition-all">
                  Ver Cursos
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-6xl mb-4 text-etpc-blue">
                    <FaFlask />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Conhecimento na Prática</h3>
                  <p className="text-white/90 mb-6">
                    Laboratórios modernos e experiências reais
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-sm text-white/80">Prático</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-sm text-white/80">Suporte</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nosso Método de Ensino</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conhecimento na prática, valorizando experiências em laboratórios, empresas e universidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaFlask,
                title: 'Laboratórios Modernos',
                description: 'Infraestrutura completa com equipamentos de última geração para aprendizado prático e experimental.',
                color: 'from-etpc-blue to-etpc-blue-dark'
              },
              {
                icon: FaIndustry,
                title: 'Experiência em Empresas',
                description: 'Parcerias com empresas para estágios e projetos reais que conectam teoria à prática profissional.',
                color: 'from-etpc-gold to-etpc-gold-dark'
              },
              {
                icon: FaGraduationCap,
                title: 'Preparação Universitária',
                description: 'Formação que prepara tanto para o mercado de trabalho quanto para o ingresso na universidade.',
                color: 'from-etpc-blue-light to-etpc-blue'
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
                  <div className="text-4xl mb-4 text-white">
                    <item.icon />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/90 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Cursos</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">
              Escolha a modalidade que melhor se adapta ao seu perfil e objetivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform text-etpc-blue">
                    <course.icon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <span className="bg-etpc-gold/10 text-etpc-gold-dark px-3 py-1 rounded-full flex items-center gap-1"><FaClock className="text-xs" /> {course.duration}</span>
                    <span className="bg-etpc-blue/10 text-etpc-blue-dark px-3 py-1 rounded-full flex items-center gap-1"><FaBullseye className="text-xs" /> {course.target}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-center leading-relaxed">{course.description}</p>
                <div className="mt-6 text-center">
                  <a href="#formulario" className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white px-6 py-3 rounded-lg font-semibold hover:from-etpc-blue-dark hover:to-etpc-blue transition-all transform hover:scale-105 shadow-lg">
                    Saiba Mais
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-20 bg-gradient-to-br from-etpc-blue-dark via-etpc-blue to-etpc-blue-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Formulário de Interesse</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white/90">
              Preencha o formulário e nossa equipe entrará em contato para realizar sua matrícula
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            {formSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Solicitação Enviada!</h3>
                <p className="text-gray-600 mb-6">
                  Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve para finalizar sua matrícula.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      responsavel: '',
                      email: '',
                      telefone: '',
                      aluno: '',
                      ano: '2024',
                      nivel: '',
                      mensagem: ''
                    });
                    setAgreedToTerms(false);
                  }}
                  className="bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
                >
                  Nova Solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo do responsável *</label>
                    <input
                      type="text"
                      name="responsavel"
                      required
                      value={formData.responsavel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                      placeholder="Nome completo do responsável"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone para contato com WhatsApp *</label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do aluno *</label>
                    <input
                      type="text"
                      name="aluno"
                      required
                      value={formData.aluno}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                      placeholder="Nome do aluno"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ano pretendido *</label>
                    <select
                      name="ano"
                      required
                      value={formData.ano}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível pretendido *</label>
                    <select
                      name="nivel"
                      required
                      value={formData.nivel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o nível</option>
                      {levelOptions.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem (opcional)</label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue focus:border-transparent transition-all resize-none"
                    placeholder="Conte-nos mais sobre seus objetivos, dúvidas ou qualquer informação adicional..."
                  ></textarea>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-etpc-blue focus:ring-etpc-blue border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                      Os dados coletados pela ETPC e Fundação CSN nesse formulário serão apenas utilizados para fins estatísticos, bem como para inclusão em nosso banco de dados e também na plataforma de NewsLetter Mailee, para que você seja notificado de assuntos relacionados às iniciativas e unidades da Fundação CSN. Ao preencher o formulário você concorda com esses termos.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white py-4 rounded-lg text-lg font-semibold hover:from-etpc-blue-dark hover:to-etpc-blue transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  ENVIAR
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Comece sua Jornada de Sucesso</h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se aos milhares de alunos que já transformaram suas vidas com a ETPC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#formulario" className="bg-white text-etpc-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-etpc-blue/5 transition-all transform hover:scale-105 shadow-xl">
              Fazer Matrícula Agora
            </a>
            <Link href="/cursos-tecnicos" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-etpc-blue transition-all transform hover:scale-105">
              Ver Todos os Cursos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
