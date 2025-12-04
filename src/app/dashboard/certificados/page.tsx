'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaGraduationCap, FaDownload, FaAward, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl?: string;
  course: {
    id: string;
    title: string;
    slug: string;
    image?: string;
    instructor: string;
    duration: string;
  };
}

export default function CertificadosPage() {
  const { data: session, status } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchCertificates();
    }
  }, [status, session]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/student/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando certificados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Certificados</h1>
        <p className="text-gray-600">Certificados de conclusão dos seus cursos</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhum certificado disponível
          </h2>
          <p className="text-gray-600 mb-6">
            Complete todos os módulos e aprove nas provas para receber seu certificado
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
          >
            Ver Meus Cursos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {cert.course.image && (
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={cert.course.image}
                    alt={cert.course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                      <FaAward />
                      Certificado
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {cert.course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {cert.course.instructor}
                </p>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Número:</span>
                    <span className="font-mono text-gray-900">{cert.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Emitido em:</span>
                    <span className="text-gray-900">{formatDate(cert.issuedAt)}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/certificado/${cert.certificateNumber}`}
                    target="_blank"
                    className="flex-1 bg-etpc-blue text-white py-3 px-4 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    Visualizar
                  </Link>
                  <button
                    onClick={() => window.open(`/certificado/${cert.certificateNumber}`, '_blank')}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


