'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaFileAlt, FaCheckCircle, FaTimes, FaClock, FaArrowLeft } from 'react-icons/fa';
import Toast from '@/components/Toast';

interface Question {
  id: string;
  question: string;
  order: number;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  order: number;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function ExamPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const moduleId = params.moduleId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchExam();
    }
  }, [status, session, moduleId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/student/exams?moduleId=${moduleId}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
        
        // Iniciar timer se houver tempo limite
        if (data.timeLimit) {
          setTimeLeft(data.timeLimit * 60); // Converter minutos para segundos
        }
      } else {
        setToast({ message: 'Erro ao carregar prova', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      setToast({ message: 'Erro ao carregar prova', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      setToast({ message: 'Nenhuma resposta foi selecionada', type: 'warning' });
      return;
    }

    await submitExam();
  };

  const submitExam = async () => {
    setSubmitting(true);

    try {
      const response = await fetch('/api/student/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          answers
        })
      });

      if (response.ok) {
        const resultData = await response.json();
        setResult(resultData);
        setShowResult(true);
        setToast({ 
          message: resultData.passed ? 'Parabéns! Você foi aprovado!' : 'Você não atingiu a nota mínima', 
          type: resultData.passed ? 'success' : 'warning' 
        });
      } else {
        const error = await response.json();
        setToast({ message: error.error || 'Erro ao submeter prova', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      setToast({ message: 'Erro ao submeter prova', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prova...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prova não encontrada</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-etpc-blue hover:underline"
          >
            Voltar ao curso
          </button>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push(`/dashboard/${courseSlug}`)}
            className="text-etpc-blue hover:text-etpc-blue-dark mb-6 flex items-center gap-2"
          >
            <FaArrowLeft />
            Voltar ao Curso
          </button>

          <div className={`bg-white rounded-lg shadow-xl p-8 text-center ${
            result.passed ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <FaCheckCircle className="text-5xl text-green-600" />
              ) : (
                <FaTimes className="text-5xl text-red-600" />
              )}
            </div>

            <h1 className={`text-3xl font-bold mb-4 ${
              result.passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.passed ? 'Parabéns! Aprovado!' : 'Não Aprovado'}
            </h1>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Sua Pontuação</p>
                <p className="text-4xl font-bold text-etpc-blue">{result.score}%</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Corretas</p>
                  <p className="text-2xl font-bold text-blue-900">{result.correctAnswers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{result.totalQuestions}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Mínimo</p>
                  <p className="text-2xl font-bold text-green-900">{result.passingScore}%</p>
                </div>
              </div>
            </div>

            {!result.passed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  Você precisa de {result.passingScore}% para aprovar. Continue estudando!
                </p>
              </div>
            )}

            <button
              onClick={() => router.push(`/dashboard/${courseSlug}`)}
              className="bg-etpc-blue text-white px-8 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors"
            >
              Voltar ao Curso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-etpc-blue hover:text-etpc-blue-dark mb-6 flex items-center gap-2"
        >
          <FaArrowLeft />
          Voltar
        </button>

        {/* Header da Prova */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              {exam.description && (
                <p className="text-gray-600 mt-2">{exam.description}</p>
              )}
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <FaClock />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-gray-600">{exam.questions?.length || 0} questões</span>
            {exam.isRequired && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                Obrigatória
              </span>
            )}
            <span className="text-gray-600">Nota mínima: {exam.passingScore}%</span>
          </div>
        </div>

        {/* Questões */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-8">
          {exam.questions?.map((question: Question, index: number) => (
            <div key={question.id} className="pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-etpc-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-lg font-medium text-gray-900 flex-1">
                  {question.question}
                </p>
              </div>

              <div className="ml-11 space-y-3">
                {question.options.map((option: Option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      answers[question.id] === option.id
                        ? 'border-etpc-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      className="w-5 h-5 text-etpc-blue"
                    />
                    <span className="font-medium text-gray-700 min-w-[30px]">
                      {String.fromCharCode(65 + option.order)}
                    </span>
                    <span className="text-gray-900">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Enviar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {Object.keys(answers).length} de {exam.questions?.length || 0} questões respondidas
              </p>
            </div>
            <button
              onClick={submitExam}
              disabled={submitting || Object.keys(answers).length === 0}
              className="bg-etpc-blue text-white px-8 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <FaFileAlt />
                  Enviar Prova
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


