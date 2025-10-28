'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function EditarCursoOnline() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    instructor: '',
    price: '',
    discountPrice: '',
    duration: '',
    level: 'iniciante',
    category: 'programacao',
    image: '',
    validityDays: '365',
    active: true,
    featured: false,
    whatYouWillLearn: [''],
    requirements: ''
  });

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/online-courses/${params.id}`);
      if (response.ok) {
        const course = await response.json();

        // Parse whatYouWillLearn from JSON string
        let topics = [''];
        try {
          topics = JSON.parse(course.whatYouWillLearn);
          if (!Array.isArray(topics) || topics.length === 0) {
            topics = [''];
          }
        } catch {
          topics = [''];
        }

        setFormData({
          title: course.title,
          shortDescription: course.shortDescription,
          description: course.description,
          instructor: course.instructor,
          price: course.price.toString(),
          discountPrice: course.discountPrice?.toString() || '',
          duration: course.duration,
          level: course.level,
          category: course.category,
          image: course.image || '',
          validityDays: course.validityDays?.toString() || '365',
          active: course.active,
          featured: course.featured,
          whatYouWillLearn: topics,
          requirements: course.requirements || ''
        });
      } else {
        toast.error('Curso não encontrado');
        router.push('/admin/cursos-online');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Erro ao carregar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    setFormData({
      ...formData,
      whatYouWillLearn: [...formData.whatYouWillLearn, '']
    });
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = formData.whatYouWillLearn.filter((_, i) => i !== index);
    setFormData({ ...formData, whatYouWillLearn: newTopics });
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...formData.whatYouWillLearn];
    newTopics[index] = value;
    setFormData({ ...formData, whatYouWillLearn: newTopics });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/online-courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          validityDays: parseInt(formData.validityDays),
          whatYouWillLearn: formData.whatYouWillLearn.filter(t => t.trim() !== '')
        })
      });

      if (response.ok) {
        toast.success('Curso atualizado com sucesso!');
        router.push('/admin/cursos-online');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao atualizar curso');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Erro ao atualizar curso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cursos-online"
            className="text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Curso Online</h1>
            <p className="text-gray-600 mt-1">Atualize os dados do curso</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Curso *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Ex: Desenvolvimento Web Completo com React"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Curta *
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Resumo em uma linha"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Completa *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Descrição detalhada do curso..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrutor *
              </label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Nome do instrutor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="Ex: 40 horas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              >
                <option value="programacao">Programação</option>
                <option value="design">Design</option>
                <option value="negocios">Negócios</option>
                <option value="marketing">Marketing</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="desenvolvimento-pessoal">Desenvolvimento Pessoal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preços e Validade */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preços e Validade</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Normal (R$) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Promocional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="0.00 (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validade (dias) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="365"
              />
              <p className="text-sm text-gray-500 mt-1">
                Prazo de acesso em dias (365 = 1 ano)
              </p>
            </div>
          </div>
        </div>

        {/* Imagem */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Imagem</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Cole a URL de uma imagem externa
            </p>
          </div>
        </div>

        {/* O que você vai aprender */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">O que você vai aprender</h2>

          <div className="space-y-3">
            {formData.whatYouWillLearn.map((topic, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  placeholder={`Tópico ${index + 1}`}
                />
                {formData.whatYouWillLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTopic}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Adicionar Tópico
            </button>
          </div>
        </div>

        {/* Pré-requisitos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pré-requisitos</h2>

          <div>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Liste os pré-requisitos necessários..."
            />
          </div>
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Curso ativo (visível para compra)</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Curso em destaque</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/cursos-online"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <FaSave />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
