'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaBullseye, FaChartLine, FaCalendarAlt, FaHandshake, FaIndustry } from 'react-icons/fa';

export default function InCompany() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const benefits = [
    {
      icon: FaBullseye,
      title: 'Soluções Customizadas',
      description: 'Desenvolvemos programas específicos para as necessidades únicas de cada empresa, garantindo máxima relevância e aplicabilidade.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FaChartLine,
      title: 'Otimização de Investimentos',
      description: 'Maximizamos o retorno do investimento em capacitação através de análises detalhadas e planos estratégicos personalizados.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FaIndustry,
      title: 'Qualificação Específica',
      description: 'Focamos na qualificação e aperfeiçoamento da mão de obra específica da sua empresa, atendendo demandas técnicas precisas.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: FaHandshake,
      title: 'Parceria Estratégica',
      description: 'Trabalhamos em parceria com sua empresa para desenvolver soluções que impulsionem o crescimento e a competitividade.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/etpc.png"
                alt="ETPC Logo"
                width={90}
                height={30}
                className="hover:scale-105 transition-transform cursor-pointer"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/quem-somos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Quem Somos</Link>
              <Link href="/fundamental2" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Fundamental 2</Link>
              <Link href="/ensinomedio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Ensino Médio</Link>
              <Link href="/cursos-tecnicos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Cursos Técnicos</Link>
              <Link href="/in-company" className="text-blue-600 font-medium relative">
                In Company
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
              </Link>
              <Link href="/matriculas" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Matrículas</Link>
              <Link href="/noticias" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Notícias</Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden bg-white border-t transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Home</Link>
            <Link href="/quem-somos" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Quem Somos</Link>
            <Link href="/fundamental2" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Fundamental 2</Link>
            <Link href="/ensinomedio" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Ensino Médio</Link>
            <Link href="/cursos-tecnicos" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Cursos Técnicos</Link>
            <Link href="/in-company" className="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">In Company</Link>
            <Link href="/matriculas" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Matrículas</Link>
            <Link href="/noticias" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Notícias</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Treinamentos
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> In Company</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Desenvolvemos diversas soluções customizadas para empresas, que permitem qualificar e aperfeiçoar mão de obra específica.
              </p>
              <p className="text-lg text-blue-200 mb-8">
                O objetivo é otimizar ao máximo os investimentos dos parceiros, assim, por meio de análises das necessidades da empresa, a ETPC elabora um plano de capacitação e treinamento para cada cliente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#formulario" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-xl">
                  Solicitar Proposta
                </a>
                <a href="#beneficios" className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all">
                  Conhecer Benefícios
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Soluções Empresariais</h3>
                  <p className="text-blue-100 mb-6">
                    Capacitação sob medida para sua empresa
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-sm text-blue-200">Customizado</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-sm text-blue-200">Suporte</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que Escolher Nossos Treinamentos In Company?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas de capacitação que se adaptam perfeitamente às necessidades da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${benefit.color} rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
                  <div className="text-4xl mb-4 text-white">
                    <benefit.icon />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-6xl mb-6 text-white">
              <FaCalendarAlt />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Próximas Turmas</h2>
            <p className="text-lg text-gray-600 mb-6">
              No momento não temos cursos In Company disponíveis, mas fique por dentro das datas de início e informações de valores!
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">📢 Fique Atualizado</h3>
              <p className="text-yellow-700">
                Preencha o formulário de interesse ou entre em contato pelo e-mail <strong>treinamentos@etpc.com.br</strong> e telefone <strong>(11) 3340-5412</strong>.
              </p>
            </div>
            <a href="#formulario" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              Demonstrar Interesse
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Tem interesse em levar para a sua empresa?</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-blue-100">
              Preencha o formulário e nossa equipe entrará em contato para desenvolver uma proposta personalizada
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            {formSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Solicitação Enviada!</h3>
                <p className="text-gray-600 mb-6">
                  Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve para discutir suas necessidades de treinamento.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      empresa: '',
                      responsavel: '',
                      email: '',
                      telefone: '',
                      assunto: '',
                      mensagem: ''
                    });
                    setAgreedToTerms(false);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar Nova Solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
                    <input
                      type="text"
                      name="empresa"
                      required
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo do Responsável *</label>
                    <input
                      type="text"
                      name="responsavel"
                      required
                      value={formData.responsavel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Corporativo *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="seu.email@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Corporativo *</label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="(11) 3333-4444"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assunto *</label>
                  <select
                    name="assunto"
                    required
                    value={formData.assunto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione o assunto</option>
                    <option value="treinamento-tecnico">Treinamento Técnico</option>
                    <option value="capacitacao-equipe">Capacitação de Equipe</option>
                    <option value="desenvolvimento-profissional">Desenvolvimento Profissional</option>
                    <option value="consultoria-tecnica">Consultoria Técnica</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sua Mensagem (opcional)</label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Conte-nos mais sobre suas necessidades de treinamento, número de funcionários, área de atuação, etc."
                  ></textarea>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                      Os dados coletados pela ETPC e Fundação CSN nesse formulário serão apenas utilizados para fins estatísticos, bem como para inclusão em nosso banco de dados e também na plataforma de NewsLetter Mailee, para que você seja notificado de assuntos relacionados às iniciativas e unidades da Fundação CSN. Ao preencher o formulário você concorda com esses termos.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Enviar Solicitação
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
            <p className="text-lg text-gray-600">
              Nossa equipe está pronta para desenvolver a solução ideal para sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Para informações sobre treinamentos corporativos</p>
                <a href="mailto:treinamentos@etpc.com.br" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  treinamentos@etpc.com.br
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">Fale diretamente com nossa equipe</p>
                <a href="tel:1133405412" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  (11) 3340-5412
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Transforme sua Empresa com Treinamentos Personalizados</h2>
          <p className="text-xl text-blue-100 mb-8">
            Desenvolva o potencial da sua equipe com soluções sob medida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#formulario" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Solicitar Proposta
            </a>
            <Link href="/cursos-tecnicos" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Ver Cursos Técnicos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
