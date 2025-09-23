import Link from 'next/link';
import { FaNewspaper, FaCamera } from 'react-icons/fa';

interface NoticiaCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    date?: string;
    createdAt?: string;
    category: string | { name: string; slug: string };
    author: string;
    featured?: boolean;
  };
  featured?: boolean;
}

export default function NoticiaCard({ article, featured = false }: NoticiaCardProps) {
  const displayDate = article.date || article.createdAt || '';
  const categoryName = typeof article.category === 'string' ? article.category : article.category.name;
  
  // Formatar a data para exibir dia/mês de forma compacta
  const formatDateForCircle = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}/${month}`;
    } catch {
      return '';
    }
  };
  if (featured) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="sm:flex">
            <div className="sm:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaNewspaper className="text-6xl mb-4 text-gray-300 mx-auto" />
                  <p className="text-lg">Imagem da Notícia</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <div className="bg-gray-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xs">
                  {formatDateForCircle(displayDate)}
                </div>
                <div className="ml-4">
                  <span className="text-gray-500 text-sm">{categoryName}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <Link href={`/noticia/${article.id}`} className="text-gray-600 font-semibold hover:text-gray-800 transition-colors">
                Read more +
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="h-48 md:h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <div className="text-center text-white">
              <FaCamera className="text-4xl mb-2 text-gray-300 mx-auto" />
              <p className="text-sm">Imagem</p>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs leading-none">
              {formatDateForCircle(displayDate)}
            </div>
            <div className="ml-3">
              <span className="text-gray-500 text-sm">{categoryName}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {article.excerpt}
          </p>
          <Link href={`/noticia/${article.id}`} className="text-gray-600 font-semibold hover:text-gray-800 transition-colors">
            Read more +
          </Link>
        </div>
      </div>
    </div>
  );
}
