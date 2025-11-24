'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaAward, FaPrint, FaSpinner } from 'react-icons/fa';

interface CertificateData {
  certificateNumber: string;
  issuedAt: string;
  studentName: string;
  studentEmail: string;
  course: {
    title: string;
    instructor: string;
    duration: string;
  };
}

export default function CertificadoPage() {
  const params = useParams();
  const certificateNumber = params.certificateNumber as string;
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificate();
  }, [certificateNumber]);

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/${certificateNumber}`);

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
      } else {
        setError('Certificado não encontrado');
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setError('Erro ao carregar certificado');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-etpc-blue mx-auto mb-4" />
          <p className="text-gray-600">Carregando certificado...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Certificado não encontrado'}
          </h1>
          <a
            href="/dashboard/certificados"
            className="text-etpc-blue hover:underline"
          >
            Voltar para meus certificados
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 print:bg-white print:py-0">
      {/* Print Button - Hide when printing */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
        >
          <FaPrint />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none">
        {/* Border Decoration */}
        <div className="border-8 border-etpc-blue p-8">
          <div className="border-4 border-double border-gray-300 p-12">

            {/* Header */}
            <div className="text-center mb-12">
              <div className="mb-6">
                <FaAward className="text-6xl text-etpc-blue mx-auto mb-4" />
              </div>
              <h1 className="text-5xl font-bold text-etpc-blue mb-2 font-serif">
                CERTIFICADO
              </h1>
              <p className="text-xl text-gray-600 uppercase tracking-widest">
                de Conclusão
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-center">
              <p className="text-lg text-gray-700">
                Certificamos que
              </p>

              <p className="text-4xl font-bold text-gray-900 border-b-2 border-gray-300 pb-4 inline-block min-w-[400px]">
                {certificate.studentName}
              </p>

              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                concluiu com êxito o curso de
              </p>

              <h2 className="text-3xl font-bold text-etpc-blue my-6">
                {certificate.course.title}
              </h2>

              <p className="text-lg text-gray-700">
                com carga horária de <strong>{certificate.course.duration}</strong>,
                ministrado por <strong>{certificate.course.instructor}</strong>.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-gray-300">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-4">Data de Emissão</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4">Número do Certificado</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {certificate.certificateNumber}
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="inline-block">
                  <div className="border-t-2 border-gray-900 w-64 mb-2"></div>
                  <p className="text-sm font-semibold text-gray-900">
                    ETPC - Escola Técnica Paulista de Cursos
                  </p>
                  <p className="text-xs text-gray-600">
                    Direção Acadêmica
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="mt-12 text-center text-xs text-gray-500">
              <p>
                Verifique a autenticidade deste certificado em:
              </p>
              <p className="font-mono mt-1">
                {typeof window !== 'undefined' && window.location.origin}/verificar/{certificate.certificateNumber}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
