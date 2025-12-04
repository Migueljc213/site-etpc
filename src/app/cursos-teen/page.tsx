'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaPhone, FaEnvelope, FaGraduationCap, FaFlask, FaRocket, FaTools, FaDesktop, FaWrench } from 'react-icons/fa';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';

export default function CursosTeenPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const courses = [
    {
      title: 'Brincando com hidráulica',
      image: 'https://etpc.com.br/wp-content/uploads/2022/08/hidraulica-cursos-livres-etpc-1920x230-1.png',
      icon: FaWrench,
      description: '<p>Este curso tem como objetivo inserir as crianças no mundo da hidráulica e desenvolvimento de experimentos utilizando materiais recicláveis encontrados facilmente no cotidiano.</p>',
      prerequisites: 'Estudantes cursando o Ensino do Fundamental II.',
      targetAudience: 'De 10 a 14 anos',
      content: '<ul><li>Conceito básico de hidráulica</li><li>Hidráulica no dia a dia</li><li>Montagem de um projeto com seringas</li><li>Montagem de um brinquedo com material reciclável</li></ul>',
      workload: '15 horas',
      value: 'R$249,90 ou 3x R$90,00 no cartão'
    },
    {
      title: 'Oficina de astronomia',
      image: 'https://etpc.com.br/wp-content/uploads/2022/08/astronomia-cursos-livres-etpc-1920x230-2.png',
      icon: FaRocket,
      description: '<p>A Oficina de Astronomia tem como objetivo apresentar os principais conceitos de física na astronomia e criar, através do conceito maker, um foguete feito de materiais caseiros capaz de decolar voo. Com a mão na massa, o aluno é capaz de entender os conceitos teóricos na prática.</p>',
      prerequisites: 'Sem pré-requisito.',
      targetAudience: 'Público infantil a partir de 10 anos',
      content: '<ul><li>Teoria do Big Bang;</li><li>Comparação entre os tamanhos dos planetas e o Sol;</li><li>Construção de um foguete;</li><li>Lançamento do foguete.</li></ul>',
      workload: '15 horas',
      value: 'R$249,90 ou 3x R$90,00 no cartão'
    },
    {
      title: 'Quimicando',
      image: 'https://etpc.com.br/wp-content/uploads/2022/08/quimicando-cursos-livres-etpc-1920x230-1.png',
      icon: FaFlask,
      description: '<p>Este curso tem como objetivo estimular os jovens a desvendar os mistérios da química do cotidiano, realizando práticas no LabQuim com o uso de materiais, vidrarias e instrumentos de laboratório para explicar as reações que ocorrem em nos lares com produtos caseiros. As experiências envolverão reações para a compreensão e estímulo as ciências químicas e físicas.</p>',
      prerequisites: 'Estudantes cursando o Ensino do Fundamental II.',
      targetAudience: 'de 10 a 14 anos',
      content: '<ul><li><strong>Colorindo o fogo</strong>: teste de mudança de cor de acordo com os sais minerais aquecidos sob o acompanhamento e instrução do professor (fogos de artifícios e modelo atômico quântico)</li><li><strong>Polímero Slime</strong>: preparo de ativador e polimerização do Slime (visco-elástico) a partir do uso de materiais como cola-branca, corantes naturais, água boricada e bicarbonato.</li><li><strong>Ferrugem instantânea</strong>: reação de formação da oxidação do aço (corrosão) em diferentes meios e estudo da velocidade de corrosão, usando-se lã de aço (Bombril), vinagre, água oxigenada e comprimido de Aspirina.</li><li><strong>Cromática</strong>: teste de acidez de produtos usados na cozinha no dia a dia, usando-se corante natural extraído do repolho roxo e do feijão e comparando com indicadores usados em laboratório, tendo como exemplos o vinagre, leite de magnésia, bicarbonato, detergente, sal etc.</li></ul>',
      workload: '15 horas',
      value: 'R$249,90 ou 3x R$90,00 no cartão'
    },
    {
      title: 'Robótica',
      image: 'https://etpc.com.br/wp-content/uploads/2022/08/robotica-cursos-livres-etpc-1920x230-1.png',
      icon: FaTools,
      description: '<p>Este curso tem como objetivo inserir as crianças no mundo da robótica e desenvolver experimentos utilizando materiais recicláveis encontrados facilmente no cotidiano.</p>',
      prerequisites: 'Estudantes cursando o Ensino do Fundamental II.',
      targetAudience: 'De 10 a 14 anos',
      content: '<ul><li>Conceito de Robótica e empreendedorismo</li><li>Montagem de um robô feito de materiais recicláveis</li><li>Montagem de um carrinho</li></ul>',
      workload: '15 horas',
      value: 'R$249,90 ou 3x R$90,00 no cartão'
    },
    {
      title: 'Scratch - criando jogos',
      image: 'https://etpc.com.br/wp-content/uploads/2022/08/scratch-cursos-livres-etpc-1920x230-1.png',
      icon: FaDesktop,
      description: '<p>Aprenda como programar usando blocos com o Scratch – uma ferramenta online e gratuita do MIT (<em>Massachusetts Institute of Technology</em>). O Scratch é mais do que um jogo, é uma poderosa ferramenta de aprendizagem criativa.</p>',
      prerequisites: 'Sem pré-requisitos.',
      targetAudience: 'De 10 a 14 anos',
      content: '<ul><li>Criar jogos e animações</li><li>Remixar jogos e animações</li><li>Lógica de programação e eixos cartesianos</li></ul>',
      workload: '15 horas',
      value: 'R$249,90 ou 3x R$90,00 no cartão'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="/cursos-teen" />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-etpc-blue-dark via-etpc-blue to-etpc-blue-light text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-etpc-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-etpc-blue-light/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-etpc-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold font-poppins leading-tight mb-4">
              Cursos <span className="text-etpc-gold">Teen</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              Cursos de curta duração voltados para o público infanto-juvenil. Mais informações, ligue (24) 3340-5412 ou envie e-mail para treinamentos@etpc.com.br.
            </p>
            <Link
              href="#courses-list"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-etpc-blue bg-etpc-gold hover:bg-etpc-gold-dark transition-colors duration-300 shadow-lg"
            >
              PREENCHA O FORMULÁRIO DE INTERESSE <FaChevronDown className="ml-2" />
            </Link>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="https://etpc.com.br/wp-content/uploads/2022/09/cursos-livres-etpc-485x750-1.png"
              alt="Cursos Teen"
              width={400}
              height={600}
              className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Courses List Section */}
      <section id="courses-list" className="py-16 bg-gradient-to-br from-etpc-blue-light via-etpc-blue to-etpc-blue-dark flex-grow">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border border-etpc-blue/20">
                <button
                  className="flex justify-between items-center w-full p-6 text-left text-xl font-semibold text-etpc-blue-dark bg-white hover:bg-etpc-blue/5 transition-colors duration-200"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="flex items-center">
                    {course.icon && <course.icon className="mr-3 text-etpc-blue" />}
                    {course.title}
                  </span>
                  {openAccordion === index ? <FaChevronUp className="text-etpc-blue" /> : <FaChevronDown className="text-etpc-blue" />}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openAccordion === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    maxHeight: openAccordion === index ? '1000px' : '0px',
                  }}
                >
                  <div className="p-6 border-t border-etpc-blue/20 bg-white">
                    <div className="mb-6 relative h-48 md:h-64 w-full rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-etpc-blue-dark space-y-4">
                      <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: course.description }} />
                      <div className="bg-etpc-blue/5 p-4 rounded-lg">
                        <strong className="text-etpc-blue-dark font-semibold">Pré-requisito:</strong>
                        <p className="text-gray-700 mt-1">{course.prerequisites}</p>
                      </div>
                      <div className="bg-etpc-gold/5 p-4 rounded-lg">
                        <strong className="text-etpc-blue-dark font-semibold">Público Alvo:</strong>
                        <p className="text-gray-700 mt-1">{course.targetAudience}</p>
                      </div>
                      <div className="bg-etpc-blue/5 p-4 rounded-lg">
                        <strong className="text-etpc-blue-dark font-semibold">Conteúdo:</strong>
                        <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: course.content }} />
                      </div>
                      <div className="bg-etpc-gold/5 p-4 rounded-lg">
                        <strong className="text-etpc-blue-dark font-semibold">Carga Horária:</strong>
                        <p className="text-gray-700 mt-1">{course.workload}</p>
                      </div>
                      <div className="bg-etpc-blue/5 p-4 rounded-lg">
                        <strong className="text-etpc-blue-dark font-semibold">Valor:</strong>
                        <p className="text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: course.value }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
