'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUsers, FaGraduationCap, FaUserTie, FaBook, FaStar, FaChalkboardTeacher, FaBullseye, FaDesktop, FaTrophy, FaFlask } from 'react-icons/fa';

export default function Fundamental2() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    escola: '',
    serie: '',
    interesse: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-sm py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:scale-110 transition-transform cursor-pointer">ETPC</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/quem-somos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Quem Somos</Link>
              <Link href="/fundamental2" className="text-blue-600 font-medium relative">
                Fundamental 2
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
              </Link>
              <Link href="/ensinomedio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Ensino Médio</Link>
              <Link href="/cursos-tecnicos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Cursos Técnicos</Link>
              <Link href="/in-company" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">In Company</Link>
              <Link href="/matriculas" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Matrículas</Link>
              <Link href="/noticias" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Notícias</Link>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                Inscreva-se
              </button>
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
            <Link href="/fundamental2" className="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">Fundamental 2</Link>
            <Link href="/ensinomedio" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Ensino Médio</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Fundamental 2 no
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> ETPC</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Prepare seu filho para o futuro com uma base sólida em educação e tecnologia.
            Do 6º ao 9º ano com metodologia inovadora e preparação para os desafios do ensino médio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#formulario" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-xl">
              Demonstre Interesse
            </a>
            <a href="#vantagens" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all">
              Conheça as Vantagens
            </a>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="vantagens" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que escolher o Fundamental 2 no ETPC?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma formação completa que prepara seu filho para os desafios do ensino médio e da vida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaBullseye,
                title: 'Base Sólida para o Futuro',
                description: 'Preparação completa para o ensino médio técnico com foco no desenvolvimento de competências essenciais.',
                features: ['Matemática avançada', 'Ciências aplicadas', 'Língua portuguesa']
              },
              {
                icon: FaDesktop,
                title: 'Tecnologia na Educação',
                description: 'Introdução à programação, robótica educacional e ferramentas digitais desde cedo.',
                features: ['Programação básica', 'Robótica educacional', 'Informática aplicada']
              },
              {
                icon: FaFlask,
                title: 'Laboratórios Modernos',
                description: 'Aulas práticas em laboratórios equipados para experimentação e descoberta científica.',
                features: ['Lab. de ciências', 'Lab. de informática', 'Projetos práticos']
              },
              {
                icon: FaUsers,
                title: 'Desenvolvimento Social',
                description: 'Projetos colaborativos que desenvolvem trabalho em equipe e liderança.',
                features: ['Projetos em grupo', 'Apresentações', 'Liderança jovem']
              },
              {
                icon: FaStar,
                title: 'Metodologia Inovadora',
                description: 'Aprendizagem baseada em projetos com metodologias ativas e personalizadas.',
                features: ['Ensino personalizado', 'Projetos reais', 'Metodologia ativa']
              },
              {
                icon: FaTrophy,
                title: 'Preparação Diferenciada',
                description: 'Orientação vocacional e preparação para escolha consciente do curso técnico.',
                features: ['Orientação vocacional', 'Visitas técnicas', 'Mentoria educacional']
              }
            ].map((advantage, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group border border-gray-100">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform text-blue-600">
                  <advantage.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{advantage.title}</h3>
                <p className="text-gray-600 mb-6">{advantage.description}</p>
                <ul className="space-y-2">
                  {advantage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nossos Resultados no Fundamental 2</h3>
            <p className="text-gray-600">Dados que comprovam a excelência da nossa educação</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '96%', label: 'Aprovação no Ensino Médio', icon: FaBook },
              { number: '89%', label: 'Escolhem cursos técnicos', icon: FaGraduationCap },
              { number: '15+', label: 'Anos de experiência', icon: FaStar },
              { number: '100%', label: 'Professores especializados', icon: FaChalkboardTeacher }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4 text-blue-600">
                  <stat.icon />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <div className="text-6xl mb-6">💬</div>
            <blockquote className="text-2xl text-white font-medium mb-8 leading-relaxed italic">
              &ldquo;Minha filha estudou o Fundamental 2 no ETPC e chegou ao ensino médio técnico muito mais preparada que os colegas.
              A base sólida que ela recebeu fez toda a diferença no seu desenvolvimento acadêmico e pessoal.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                <FaUserTie className="text-2xl" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Maria Santos</div>
                <div className="text-blue-100">Mãe de aluna do ETPC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Demonstre seu Interesse</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">
              Preencha o formulário e receba mais informações sobre o Fundamental 2 no ETPC
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            {formSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Interesse Registrado!</h3>
                <p className="text-gray-600">Em breve entraremos em contato com você.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Responsável *</label>
                    <input
                      type="text"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Escola Atual do Aluno</label>
                    <input
                      type="text"
                      name="escola"
                      value={formData.escola}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome da escola atual"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Série de Interesse *</label>
                  <select
                    name="serie"
                    required
                    value={formData.serie}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione a série</option>
                    <option value="6ano">6º Ano</option>
                    <option value="7ano">7º Ano</option>
                    <option value="8ano">8º Ano</option>
                    <option value="9ano">9º Ano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Como podemos ajudar?</label>
                  <textarea
                    name="interesse"
                    value={formData.interesse}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Conte-nos sobre seus interesses e dúvidas..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Enviar Interesse
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Agende uma Visita</h2>
          <p className="text-xl text-gray-300 mb-8">
            Venha conhecer nossa estrutura e metodologia de perto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl">
              Agendar Visita
            </button>
            <Link href="/" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}