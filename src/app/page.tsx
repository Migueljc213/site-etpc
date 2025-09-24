'use client';

import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import { FaStar, FaCamera, FaLaptopCode, FaTools, FaChartBar, FaCheck, FaBriefcase, FaRocket, FaChalkboardTeacher, FaUserTie, FaDesktop, FaFlask, FaWrench, FaShieldAlt } from 'react-icons/fa';
import BannerCarousel from '@/components/BannerCarousel';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [banners, setBanners] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);


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

    const fetchGalleryPhotos = async () => {
      try {
        const response = await fetch('/api/gallery?active=true');
        const data = await response.json();
        setGalleryPhotos(data);
      } catch (error) {
        console.error('Error fetching gallery photos:', error);
      }
    };

    fetchBanners();
    fetchGalleryPhotos();
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
      <Header currentPage="/" />

      {/* Hero Section - Carrossel de Banners */}
      <section className="relative overflow-hidden">
        {/* Carrossel de Banners - Full Screen */}
        <BannerCarousel 
          banners={banners} 
          autoPlay={true} 
          interval={5000}
        />

      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section id="sobre" className={`py-16 bg-white transition-all duration-1000 ${visibleSections.has('sobre') ? 'opacity-100' : 'opacity-0'}`}>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-etpc-blue transition-colors">Nossa Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transformar vidas através da educação técnica de excelência, preparando profissionais qualificados e prontos para os desafios do mercado de trabalho moderno. Acreditamos que a educação é a chave para o desenvolvimento pessoal e profissional.
                </p>
              </div>

              <div className="group">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-etpc-blue transition-colors">Nossa Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser reconhecida como a melhor instituição de ensino técnico do país, referência em inovação pedagógica, tecnologia educacional e formação de profissionais que fazem a diferença no mercado.
                </p>
              </div>

              <div className="group">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-etpc-blue transition-colors">Nossos Valores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Excelência', 'Inovação', 'Ética', 'Comprometimento'].map((valor, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 hover:text-etpc-blue transition-colors cursor-pointer">
                      <svg className="w-5 h-5 text-etpc-blue" fill="currentColor" viewBox="0 0 20 20">
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
                <div className="bg-etpc-blue rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-white/80">Anos de história</div>
                </div>
                <div className="bg-gradient-to-br from-etpc-gold to-etpc-gold-dark rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">20+</div>
                  <div className="text-yellow-100">Laboratórios modernos</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-etpc-blue-light to-etpc-blue rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Professores especialistas</div>
                </div>
                <div className="bg-etpc-gold rounded-2xl p-8 text-white hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl font-bold mb-2">MEC</div>
                  <div className="text-yellow-100">Nota máxima</div>
                </div>
              </div>
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
            {galleryPhotos.length > 0 ? (
              galleryPhotos.slice(0, 8).map((photo) => (
                <div key={photo.id} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all">
                  <div className="aspect-square relative">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 text-white">
                      <div className="font-semibold font-poppins">{photo.title}</div>
                      <div className="text-sm text-gray-300 capitalize font-poppins">{photo.category}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Placeholder quando não há fotos
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all">
                  <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <FaCamera className="text-4xl mb-2 text-gray-300 mx-auto" />
                      <p className="text-sm font-medium font-poppins">[Espaço para foto]</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <a href="/admin/galeria" className="bg-etpc-blue text-white px-8 py-3 rounded-full hover:bg-etpc-blue-dark transition-all transform hover:scale-105 shadow-lg inline-block">
              Ver mais fotos
            </a>
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
                title: 'Informática',
                description: 'Especialize-se em desenvolvimento de software e sistemas',
                features: ['Programação Web', 'Banco de Dados', 'Desenvolvimento Mobile'],
                color: 'bg-green-500',
                link: '/cursos-tecnicos#cursos'
              },
              {
                icon: 'FaWrench',
                title: 'Mecânica',
                description: 'Especialize-se em Mecânica Industrial com foco em manutenção',
                features: ['Manutenção Industrial', 'CNC e CAD/CAM', 'Automação Mecânica'],
                color: 'bg-red-500',
                link: '/cursos-tecnicos#cursos'
              },
              {
                icon: 'FaShieldAlt',
                title: 'Segurança do Trabalho',
                description: 'Especialize-se em Segurança do Trabalho, área em crescimento',
                features: ['Prevenção de Acidentes', 'Gestão de Riscos', 'Auditoria e Perícias'],
                color: 'bg-emerald-500',
                link: '/cursos-tecnicos#cursos'
              }
            ].map((program, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${program.color} transform scale-x-0 group-hover:scale-x-100 transition-transform`}></div>
                <div className="text-5xl mb-4 text-gray-600 group-hover:scale-110 transition-transform">
                  {program.icon === 'FaLaptopCode' && <FaLaptopCode />}
                  {program.icon === 'FaWrench' && <FaWrench />}
                  {program.icon === 'FaShieldAlt' && <FaShieldAlt />}
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
                <a 
                  href={program.link}
                  className="block w-full bg-etpc-blue text-white py-3 rounded-lg hover:bg-etpc-blue-dark transition-all font-semibold group-hover:shadow-lg text-center"
                >
                  Saiba mais
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-blue-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Anos de excelência', icon: FaStar },
              { number: '98%', label: 'Aprovação no mercado', icon: FaBriefcase },
              { number: '500+', label: 'Projetos realizados', icon: FaRocket },
              { number: '100+', label: 'Professores especialistas', icon: FaChalkboardTeacher }
            ].map((stat, index) => (
              <div key={index} className="text-white group cursor-pointer flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-5xl font-poppins font-bold group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-white/80 group-hover:text-white transition-colors font-poppins text-center text-sm leading-tight">{stat.label}</div>
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
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-etpc-blue to-etpc-gold rounded-full flex items-center justify-center text-white text-2xl mr-4">
                    <testimonial.image className="text-2xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-etpc-blue transition-colors">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Notícias Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog & Notícias
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades, eventos e conquistas da ETPC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card de Notícia 1 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="relative h-48 bg-gradient-to-br from-etpc-blue to-etpc-blue-dark">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaNewspaper className="text-6xl mb-4 mx-auto opacity-80" />
                    <p className="text-lg font-medium">Imagem da Notícia</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-etpc-blue px-3 py-1 rounded-full text-sm font-semibold">
                    Notícias
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>15/01/2024</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Admin ETPC</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-etpc-blue transition-colors">
                  ETPC inaugura novos laboratórios de tecnologia
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  A ETPC expande sua infraestrutura com laboratórios modernos equipados com as mais recentes tecnologias para proporcionar uma experiência de aprendizado ainda mais completa...
                </p>
                <a href="/noticias" className="text-etpc-blue font-semibold hover:text-etpc-blue-dark transition-colors inline-flex items-center">
                  Ler mais <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </article>

            {/* Card de Notícia 2 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="relative h-48 bg-gradient-to-br from-etpc-gold to-etpc-gold-dark">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaGraduationCap className="text-6xl mb-4 mx-auto opacity-80" />
                    <p className="text-lg font-medium">Imagem da Notícia</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-etpc-gold-dark px-3 py-1 rounded-full text-sm font-semibold">
                    Eventos
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>12/01/2024</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Admin ETPC</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-etpc-blue transition-colors">
                  Formatura 2024: Celebração do sucesso dos nossos alunos
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Mais de 200 alunos se formaram nos cursos técnicos da ETPC, prontos para ingressar no mercado de trabalho com excelente qualificação...
                </p>
                <a href="/noticias" className="text-etpc-blue font-semibold hover:text-etpc-blue-dark transition-colors inline-flex items-center">
                  Ler mais <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </article>

            {/* Card de Notícia 3 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="relative h-48 bg-gradient-to-br from-etpc-blue-light to-etpc-blue">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaBriefcase className="text-6xl mb-4 mx-auto opacity-80" />
                    <p className="text-lg font-medium">Imagem da Notícia</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-etpc-blue px-3 py-1 rounded-full text-sm font-semibold">
                    Parcerias
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>08/01/2024</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Admin ETPC</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-etpc-blue transition-colors">
                  Nova parceria com empresas da região
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  ETPC firma parcerias estratégicas com empresas locais para oferecer estágios e oportunidades de emprego aos nossos alunos...
                </p>
                <a href="/noticias" className="text-etpc-blue font-semibold hover:text-etpc-blue-dark transition-colors inline-flex items-center">
                  Ler mais <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <a href="/noticias" className="inline-flex items-center bg-etpc-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-etpc-blue-dark transition-all transform hover:scale-105">
              Ver todas as notícias
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-blue-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu futuro?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de profissionais de sucesso formados pelo ETPC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/matriculas" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-etpc-blue transition-all transform hover:scale-105 inline-block">
              Fale conosco
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}