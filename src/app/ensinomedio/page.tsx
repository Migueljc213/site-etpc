'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import { FaBriefcase, FaGraduationCap, FaChartBar, FaClock, FaUserTie, FaChartLine, FaBullseye, FaEdit, FaUniversity, FaBook, FaFlask, FaDesktop, FaWrench } from 'react-icons/fa';

export default function EnsinoMedio() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    escola: '',
    serie: '',
    curso: '',
    interesse: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);


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
      <Header currentPage="/ensinomedio" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-etpc-blue/5 via-white to-etpc-gold/5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-etpc-blue/20 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-etpc-gold/20 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Ensino Médio Técnico
            <span className="bg-gradient-to-r from-etpc-blue to-etpc-gold bg-clip-text text-transparent"> ETPC</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Conheça as vantagens do Ensino Médio com Curso Técnico.
            Prepare-se para o ENEM, vestibulares e para o mercado de trabalho simultaneamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#formulario" className="bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-etpc-blue-dark hover:to-etpc-blue-dark transition-all transform hover:scale-105 shadow-xl">
              Demonstre Interesse
            </a>
            <a href="#vantagens" className="bg-white text-etpc-blue px-8 py-4 rounded-full text-lg font-semibold border-2 border-etpc-blue hover:bg-etpc-blue/5 transition-all">
              Conheça as Vantagens
            </a>
          </div>
        </div>
      </section>

      {/* Main Advantages Section */}
      <section id="vantagens" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Conheça as vantagens do Ensino Médio com Curso Técnico</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma formação completa que combina excelência acadêmica com preparação profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {[
              {
                icon: FaBook,
                title: 'Preparação para o ENEM e demais vestibulares',
                description: 'Currículo completo com foco na preparação para os principais vestibulares do país, incluindo simulados e aulas específicas para o ENEM.',
                features: ['Simulados mensais', 'Aulas de redação', 'Orientação para vestibulares', 'Material didático atualizado']
              },
              {
                icon: FaBriefcase,
                title: 'Curso Técnico que coloca os estudantes em contato com o mercado',
                description: 'Formação técnica especializada com laboratórios modernos e parcerias com empresas para estágios e oportunidades profissionais.',
                features: ['Estágios remunerados', 'Parcerias empresariais', 'Certificação técnica', 'Projetos reais']
              },
              {
                icon: FaGraduationCap,
                title: 'Melhor desempenho durante a universidade',
                description: 'Alunos chegam à universidade com base técnica sólida, facilitando o aprendizado em cursos de engenharia e tecnologia.',
                features: ['Base técnica sólida', 'Experiência prática', 'Metodologia científica', 'Pensamento crítico']
              },
              {
                icon: FaFlask,
                title: 'Conteúdo acadêmico e aulas práticas em laboratórios',
                description: 'Integração perfeita entre teoria e prática com laboratórios equipados e professores especialistas do mercado.',
                features: ['20+ laboratórios', 'Equipamentos modernos', 'Professores especialistas', 'Projetos inovadores']
              }
            ].map((advantage, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group border border-gray-100">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform text-etpc-blue">
                  <advantage.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-etpc-blue transition-colors">{advantage.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{advantage.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {advantage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 text-sm">
                      <svg className="w-4 h-4 text-etpc-blue mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Cursos Técnicos Disponíveis</h3>
            <p className="text-gray-600">Escolha sua área de especialização</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaDesktop,
                title: 'Desenvolvimento de Sistemas',
                description: 'Programação, desenvolvimento web, mobile e sistemas empresariais',
                duration: '3 anos',
                market: '95% empregabilidade'
              },
              {
                icon: FaWrench,
                title: 'Eletromecânica',
                description: 'Manutenção industrial, automação e sistemas elétricos',
                duration: '3 anos',
                market: '92% empregabilidade'
              },
              {
                icon: FaChartBar,
                title: 'Administração',
                description: 'Gestão empresarial, recursos humanos e empreendedorismo',
                duration: '3 anos',
                market: '88% empregabilidade'
              }
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <div className="text-5xl mb-4 text-etpc-blue">
                  <course.icon />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h4>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FaClock className="text-xs" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><FaChartLine className="text-xs" /> {course.market}</span>
                </div>
                <button className="w-full bg-etpc-blue text-white py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors font-semibold">
                  Saiba mais
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-r from-etpc-blue to-etpc-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <div className="text-6xl mb-6 text-white">
              <FaUserTie />
            </div>
            <blockquote className="text-2xl text-white font-medium mb-8 leading-relaxed italic">
              &ldquo;Fiz Ensino Médio com técnico em Eletromecânica na ETPC e tenho o privilégio de dizer que por causa do meu curso consegui um estágio, uma promoção e uma carreira. Hoje sou técnico de manutenção em uma multinacional na área de gás e estou muito satisfeito com a minha carreira. O aprendizado da escola, eu levo para a minha vida até hoje&rdquo;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                <FaUserTie className="text-2xl" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Felipe Lemos</div>
                <div className="text-white/80">Ex-aluno da ETPC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nossos Resultados no Ensino Médio Técnico</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '87%', label: 'Aprovação em vestibulares', icon: FaBullseye },
              { number: '94%', label: 'Inserção no mercado', icon: FaBriefcase },
              { number: '750+', label: 'Média no ENEM', icon: FaEdit },
              { number: '85%', label: 'Seguem para universidade', icon: FaUniversity }
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-etpc-blue/5 to-etpc-gold/5 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-4 text-etpc-blue">
                  <stat.icon />
                </div>
                <div className="text-4xl font-bold text-etpc-blue mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Demonstre seu Interesse</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-etpc-blue to-etpc-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">
              Preencha o formulário e receba mais informações sobre o Ensino Médio Técnico no ETPC
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Estudante *</label>
                    <input
                      type="text"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                      placeholder="Nome completo do estudante"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Escola Atual</label>
                    <input
                      type="text"
                      name="escola"
                      value={formData.escola}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                      placeholder="Nome da escola atual"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Série Atual *</label>
                    <select
                      name="serie"
                      required
                      value={formData.serie}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione a série</option>
                      <option value="9ano">9º Ano</option>
                      <option value="1ano">1º Ano Ensino Médio</option>
                      <option value="2ano">2º Ano Ensino Médio</option>
                      <option value="3ano">3º Ano Ensino Médio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Curso Técnico de Interesse</label>
                    <select
                      name="curso"
                      value={formData.curso}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione um curso</option>
                      <option value="desenvolvimento">Desenvolvimento de Sistemas</option>
                      <option value="eletromecânica">Eletromecânica</option>
                      <option value="administracao">Administração</option>
                      <option value="ainda-decidindo">Ainda estou decidindo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Como podemos ajudar?</label>
                  <textarea
                    name="interesse"
                    value={formData.interesse}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-etpc-blue/50 focus:border-transparent transition-all"
                    placeholder="Conte-nos sobre seus objetivos, dúvidas ou interesses específicos..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-etpc-blue to-etpc-blue-dark text-white py-4 rounded-lg text-lg font-semibold hover:from-etpc-blue-dark hover:to-etpc-blue-dark transition-all transform hover:scale-105 shadow-lg"
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
          <h2 className="text-4xl font-bold mb-6">Construa seu Futuro Profissional</h2>
          <p className="text-xl text-gray-300 mb-8">
            Agende uma visita e conheça nossa infraestrutura e metodologia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-etpc-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-etpc-blue-dark transition-all transform hover:scale-105 shadow-xl">
              Agendar Visita
            </button>
            <Link href="/" className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}