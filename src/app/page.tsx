'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaCamera, FaLaptopCode, FaTools, FaChartBar, FaCheck, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaBriefcase, FaRocket, FaChalkboardTeacher, FaUserTie, FaDesktop, FaFlask } from 'react-icons/fa';
import BannerCarousel from '@/components/BannerCarousel';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?position=homepage-carousel&active=true');
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    // Adicionar observador para a seção de estatísticas
    const statsSection = document.getElementById('stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, []);

  // Removido parallaxStyle não utilizado

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-sm py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900 hover:scale-105 transition-transform cursor-pointer">ETPC</span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="/quem-somos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Quem Somos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/fundamental2" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Fundamental 2
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/ensinomedio" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Ensino Médio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/cursos-tecnicos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Cursos Técnicos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/in-company" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                In Company
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/matriculas" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Matrículas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
              <a href="/noticias" className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group">
                Notícias
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all group-hover:w-full"></span>
              </a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="/quem-somos" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Quem Somos</a>
            <a href="/fundamental2" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Fundamental 2</a>
            <a href="/ensinomedio" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Ensino Médio</a>
            <a href="/cursos-tecnicos" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Cursos Técnicos</a>
            <a href="/in-company" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">In Company</a>
            <a href="/matriculas" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Matrículas</a>
            <a href="/noticias" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Notícias</a>
          </div>
        </div>
      </nav>

      {/* Hero Section com Carrossel de Banners */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className={`transition-all duration-1000 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transforme seu futuro no
                <span className="text-gray-900"> ETPC</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Educação técnica de excelência que conecta você às melhores oportunidades do mercado.
                Prepare-se para liderar a próxima geração de profissionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/matriculas" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  Comece sua jornada
                </a>
                <a href="/cursos-tecnicos" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all hover:shadow-lg">
                  Conheça os cursos
                </a>
              </div>
            </div>
          </div>

          {/* Carrossel de Banners */}
          <div className="mb-12">
            <BannerCarousel 
              banners={banners} 
              autoPlay={true} 
              interval={5000}
            />
          </div>

          {/* Estatísticas */}
          <div id="stats" className="grid md:grid-cols-4 gap-8 text-center">
            <div className={`transition-all duration-1000 delay-200 ${visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Taxa de empregabilidade</div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-4xl font-bold text-gray-900 mb-2">2000+</div>
              <div className="text-gray-600">Alunos formados</div>
            </div>
            <div className={`transition-all duration-1000 delay-400 ${visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Empresas parceiras</div>
            </div>
            <div className={`transition-all duration-1000 delay-500 ${visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">Avaliação dos alunos</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Quem Somos */}
      <section id="sobre" className={`py-20 bg-white transition-all duration-1000 ${visibleSections.has('sobre') ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quem Somos</h2>
            <div className="w-24 h-1 bg-gray-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Há mais de 15 anos formando os melhores profissionais técnicos do mercado
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="group">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Nossa Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transformar vidas através da educação técnica de excelência, preparando profissionais qualificados e prontos para os desafios do mercado de trabalho moderno. Acreditamos que a educação é a chave para o desenvolvimento pessoal e profissional.
                </p>
              </div>

              <div className="group">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Nossa Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser reconhecida como a melhor instituição de ensino técnico do país, referência em inovação pedagógica, tecnologia educacional e formação de profissionais que fazem a diferença no mercado.
                </p>
              </div>

              <div className="group">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Nossos Valores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Excelência', 'Inovação', 'Ética', 'Comprometimento'].map((valor, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {valor}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-blue-600 rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-blue-100">Anos de história</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">20+</div>
                  <div className="text-indigo-100">Laboratórios modernos</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-blue-100">Professores especialistas</div>
                </div>
                <div className="bg-yellow-400 rounded-2xl p-8 text-gray-900 hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">MEC</div>
                  <div className="text-gray-700">Nota máxima</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossa Trajetória</h3>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-indigo-600"></div>
              {[
                { year: '2009', event: 'Fundação do ETPC', description: 'Início com 3 cursos técnicos' },
                { year: '2015', event: 'Expansão Nacional', description: 'Abertura de 5 novas unidades' },
                { year: '2020', event: 'Transformação Digital', description: '100% dos cursos com modalidade híbrida' },
                { year: '2024', event: 'Excelência Reconhecida', description: 'Top 3 melhores escolas técnicas do Brasil' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                      <div className="text-blue-600 font-bold text-xl mb-2">{item.year}</div>
                      <div className="text-gray-900 font-semibold mb-1">{item.event}</div>
                      <div className="text-gray-600 text-sm">{item.description}</div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Student Gallery Section */}
      <section id="galeria" className={`py-20 bg-gray-50 transition-all duration-1000 ${visibleSections.has('galeria') ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Alunos em Ação</h2>
            <div className="w-24 h-1 bg-gray-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça um pouco do dia a dia dos nossos estudantes e as experiências transformadoras que vivem no ETPC
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'Laboratório de Robótica', category: 'Engenharia' },
              { title: 'Hackathon 2024', category: 'Programação' },
              { title: 'Apresentação de Projetos', category: 'Inovação' },
              { title: 'Aula Prática', category: 'Mecatrônica' },
              { title: 'Workshop de IA', category: 'Tecnologia' },
              { title: 'Feira de Ciências', category: 'Pesquisa' },
              { title: 'Formatura 2023', category: 'Celebração' },
              { title: 'Competição Nacional', category: 'Conquistas' }
            ].map((item, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all">
                <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <FaCamera className="text-4xl mb-2 text-gray-300 mx-auto" />
                    <p className="text-sm font-medium">[Espaço para foto]</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4 text-white">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-300">{item.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
              Ver mais fotos
            </button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programas" className={`py-20 bg-white transition-all duration-1000 ${visibleSections.has('programas') ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Programas de Excelência</h2>
            <div className="w-24 h-1 bg-gray-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cursos técnicos desenvolvidos em parceria com as maiores empresas do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'FaLaptopCode',
                title: 'Desenvolvimento de Software',
                description: 'Domine as tecnologias mais demandadas do mercado',
                features: ['Full-stack', 'Cloud Computing', 'IA & Machine Learning'],
                color: 'bg-gray-400'
              },
              {
                icon: 'FaTools',
                title: 'Engenharia Mecatrônica',
                description: 'Integre mecânica, eletrônica e programação',
                features: ['Robótica', 'Automação Industrial', 'IoT'],
                color: 'bg-gray-400'
              },
              {
                icon: 'FaChartBar',
                title: 'Análise de Dados',
                description: 'Transforme dados em decisões estratégicas',
                features: ['Business Intelligence', 'Data Science', 'Big Data'],
                color: 'bg-gray-400'
              }
            ].map((program, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${program.color} transform scale-x-0 group-hover:scale-x-100 transition-transform`}></div>
                <div className="text-5xl mb-4 text-gray-600 group-hover:scale-110 transition-transform">
                  {program.icon === 'FaLaptopCode' && <FaLaptopCode />}
                  {program.icon === 'FaTools' && <FaTools />}
                  {program.icon === 'FaChartBar' && <FaChartBar />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">{program.title}</h3>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                      <FaCheck className="w-5 h-5 text-gray-600 mr-2 group-hover:scale-110 transition-transform" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold group-hover:shadow-lg">
                  Saiba mais
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Anos de excelência', icon: FaStar },
              { number: '98%', label: 'Aprovação no mercado', icon: FaBriefcase },
              { number: '500+', label: 'Projetos realizados', icon: FaRocket },
              { number: '100+', label: 'Professores especialistas', icon: FaChalkboardTeacher }
            ].map((stat, index) => (
              <div key={index} className="text-white group cursor-pointer">
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform text-white">
                  <stat.icon />
                </div>
                <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-blue-100 group-hover:text-white transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className={`py-20 bg-white transition-all duration-1000 ${visibleSections.has('depoimentos') ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que nossos alunos dizem</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Histórias de sucesso que inspiram</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ana Silva',
                role: 'Desenvolvedora na Tech Corp',
                text: 'O ETPC mudou minha vida. A qualidade do ensino e o suporte dos professores me prepararam perfeitamente para o mercado.',
                image: FaDesktop
              },
              {
                name: 'Carlos Oliveira',
                role: 'Engenheiro de Dados',
                text: 'Infraestrutura de ponta e professores do mercado. Consegui meu emprego dos sonhos antes mesmo de me formar.',
                image: FaUserTie
              },
              {
                name: 'Marina Santos',
                role: 'Analista de Sistemas',
                text: 'Metodologia prática e projetos reais. No ETPC, cada dia é uma oportunidade de crescimento profissional.',
                image: FaFlask
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer group">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                    <testimonial.image className="text-2xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu futuro?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de profissionais de sucesso formados pelo ETPC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
              Inscreva-se agora
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Fale conosco
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 hover:text-blue-400 transition-colors cursor-pointer">ETPC</h3>
              <p className="text-gray-400">Excelência em educação técnica desde 2009</p>
              <div className="flex gap-4 mt-4">
                <FaFacebook className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-500" />
                <FaInstagram className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-pink-500" />
                <FaTwitter className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-400" />
                <FaLinkedin className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Cursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Desenvolvimento</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mecatrônica</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Análise de Dados</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Institucional</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabalhe conosco</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">contato@etpc.edu.br</li>
                <li className="hover:text-white transition-colors cursor-pointer">(11) 1234-5678</li>
                <li className="hover:text-white transition-colors cursor-pointer">São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ETPC. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}