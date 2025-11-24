'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaPlus, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ExamQuestion {
  id?: string;
  question: string;
  order: number;
  options: ExamOption[];
  correctAnswer: string;
}

interface ExamOption {
  id?: string;
  text: string;
  order: number;
}

export default function ProvaPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [module, setModule] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: null as number | null,
    isRequired: true
  });
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, moduleId]);

  const fetchData = async () => {
    try {
      const [moduleRes, examRes] = await Promise.all([
        fetch(`/api/admin/online-courses/${courseId}/modules/${moduleId}`),
        fetch(`/api/admin/exams?moduleId=${moduleId}`)
      ]);

      if (moduleRes.ok) {
        const moduleData = await moduleRes.json();
        setModule(moduleData);
      }

      if (examRes.ok) {
        const examData = await examRes.json();
        if (examData && !examData.error) {
          setExam(examData);
          setExamData({
            title: examData.title,
            description: examData.description || '',
            passingScore: examData.passingScore,
            timeLimit: examData.timeLimit,
            isRequired: examData.isRequired
          });
          
          // Converter questões para formato de edição
          const formattedQuestions = examData.questions.map((q: any) => ({
            id: q.id,
            question: q.question,
            order: q.order,
            options: q.options.map((opt: any, idx: number) => ({
              id: opt.id,
              text: opt.text,
              order: opt.order !== undefined ? opt.order : idx
            })),
            correctAnswer: q.correctAnswer
          }));
          setQuestions(formattedQuestions);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      order: questions.length,
      options: [
        { text: '', order: 0 },
        { text: '', order: 1 },
        { text: '', order: 2 },
        { text: '', order: 3 }
      ],
      correctAnswer: ''
    }]);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    const newOrder = updated[questionIndex].options.length;
    updated[questionIndex].options.push({ text: '', order: newOrder });
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    // Reordenar as opções
    updated[questionIndex].options = updated[questionIndex].options.map((opt, i) => ({ ...opt, order: i }));
    // Se a resposta correta era a opção removida, limpar
    if (updated[questionIndex].correctAnswer === optionIndex.toString()) {
      updated[questionIndex].correctAnswer = '';
    }
    // Ajustar resposta correta se necessário
    else if (updated[questionIndex].correctAnswer && parseInt(updated[questionIndex].correctAnswer) > optionIndex) {
      updated[questionIndex].correctAnswer = (parseInt(updated[questionIndex].correctAnswer) - 1).toString();
    }
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      toast.error('Adicione pelo menos uma questão');
      return;
    }

    // Validar que todas as questões têm pergunta, pelo menos 2 opções válidas e resposta correta
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Questão ${i + 1} precisa ter uma pergunta`);
        return;
      }

      // Validar que há pelo menos 2 opções válidas (não vazias)
      const validOptions = q.options.filter(opt => opt.text.trim());
      if (validOptions.length < 2) {
        toast.error(`Questão ${i + 1} precisa ter pelo menos 2 opções válidas (com texto)`);
        return;
      }

      if (!q.correctAnswer) {
        toast.error(`Questão ${i + 1} precisa ter uma resposta correta selecionada`);
        return;
      }

      // Verificar se a resposta correta selecionada existe e tem texto
      const correctIndex = parseInt(q.correctAnswer);
      if (isNaN(correctIndex) || !q.options[correctIndex] || !q.options[correctIndex].text.trim()) {
        toast.error(`Questão ${i + 1}: A resposta correta selecionada não é válida`);
        return;
      }
    }

    setSaving(true);

    try {
      const questionsData = questions.map((q, i) => {
        // Filtrar opções vazias e reordenar
        const validOptions = q.options
          .map((opt, idx) => ({ ...opt, originalIndex: idx }))
          .filter(opt => opt.text.trim());
        
        // Ajustar resposta correta para o novo índice
        let adjustedCorrectAnswer = q.correctAnswer;
        if (q.correctAnswer) {
          const originalIndex = parseInt(q.correctAnswer);
          const newIndex = validOptions.findIndex(opt => opt.originalIndex === originalIndex);
          if (newIndex !== -1) {
            adjustedCorrectAnswer = newIndex.toString();
          } else {
            throw new Error(`Questão ${i + 1}: A resposta correta selecionada foi removida. Selecione uma opção válida.`);
          }
        }

        return {
          question: q.question,
          order: i,
          options: validOptions.map((opt, idx) => ({
            text: opt.text,
            order: idx
          })),
          correctAnswer: adjustedCorrectAnswer
        };
      });

      const url = exam ? `/api/admin/exams/${exam.id}` : '/api/admin/exams';
      const response = await fetch(url, {
        method: exam ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...examData,
          moduleId,
          questions: questionsData
        })
      });

      if (response.ok) {
        toast.success('Prova salva com sucesso!');
        router.back();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao salvar prova');
      }
    } catch (error: any) {
      console.error('Error saving exam:', error);
      toast.error(error.message || 'Erro ao salvar prova');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etpc-blue"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-etpc-blue hover:text-etpc-blue-dark mb-4 flex items-center gap-2"
          >
            <FaArrowLeft />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {exam ? 'Editar Prova' : 'Configurar Prova'}
          </h1>
          {module && (
            <p className="text-gray-600 mt-2">
              Módulo: {module.title}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Dados da Prova */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Prova
              </label>
              <input
                type="text"
                required
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Ex: Avaliação Módulo 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Instruções para a prova..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota Mínima (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={examData.passingScore}
                  onChange={(e) => setExamData({ ...examData, passingScore: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo Limite (min)
                </label>
                <input
                  type="number"
                  min="1"
                  value={examData.timeLimit || ''}
                  onChange={(e) => setExamData({ ...examData, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Opcional"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={examData.isRequired}
                    onChange={(e) => setExamData({ ...examData, isRequired: e.target.checked })}
                    className="w-4 h-4 text-etpc-blue rounded"
                  />
                  <span className="text-sm text-gray-700">Prova Obrigatória</span>
                </label>
              </div>
            </div>
          </div>

          {/* Questões */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Questões</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-etpc-blue text-white px-4 py-2 rounded-lg hover:bg-etpc-blue-dark transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Adicionar Questão
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Nenhuma questão adicionada ainda</p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="mt-4 text-etpc-blue hover:underline"
                >
                  Clique aqui para adicionar a primeira questão
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="bg-etpc-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                          {qIndex + 1}
                        </span>
                        Questão {qIndex + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <textarea
                      required
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Digite a pergunta..."
                    />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Opções de Resposta</label>
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="text-sm text-etpc-blue hover:text-etpc-blue-dark font-medium flex items-center gap-1"
                        >
                          <FaPlus className="text-xs" />
                          Adicionar Opção
                        </button>
                      </div>
                      {question.options.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Nenhuma opção adicionada. Adicione pelo menos 2 opções.</p>
                      ) : (
                        question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex.toString()}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex.toString())}
                              className="w-4 h-4 text-etpc-blue cursor-pointer"
                            />
                            <span className="font-medium text-gray-700 w-8 flex-shrink-0">
                              {String.fromCharCode(65 + oIndex)})
                            </span>
                            <input
                              type="text"
                              required
                              value={option.text}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-etpc-blue focus:border-transparent"
                              placeholder="Opção de resposta..."
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Remover opção"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                      {question.options.length > 0 && !question.correctAnswer && (
                        <p className="text-sm text-yellow-600 italic">⚠️ Selecione a resposta correta</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-etpc-blue text-white px-6 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave />
              {saving ? 'Salvando...' : 'Salvar Prova'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

