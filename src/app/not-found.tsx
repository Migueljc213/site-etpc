import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-etpc-blue">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-etpc-blue text-white px-8 py-3 rounded-lg hover:bg-etpc-blue-dark transition-colors font-semibold"
          >
            Voltar ao início
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-etpc-blue transition-colors">
              Acessar painel administrativo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
