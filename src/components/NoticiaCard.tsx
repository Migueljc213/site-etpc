import Link from 'next/link';

interface NoticiaCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    author: string;
    featured?: boolean;
  };
  featured?: boolean;
}

export default function NoticiaCard({ article, featured = false }: NoticiaCardProps) {
  if (featured) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="sm:flex">
            <div className="sm:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📰</div>
                  <p className="text-lg">Imagem da Notícia</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm">
                  {article.date}
                </div>
                <div className="ml-4">
                  <span className="text-gray-500 text-sm">{article.category}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <Link href={`/noticia/${article.id}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
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
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm">Imagem</p>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs">
              {article.date}
            </div>
            <div className="ml-3">
              <span className="text-gray-500 text-sm">{article.category}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {article.excerpt}
          </p>
          <Link href={`/noticia/${article.id}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Read more +
          </Link>
        </div>
      </div>
    </div>
  );
}
