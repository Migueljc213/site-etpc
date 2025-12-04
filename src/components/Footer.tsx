import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 hover:text-blue-400 transition-colors cursor-pointer block">
              ETPC
            </Link>
            <p className="text-gray-400">Excelência em educação técnica desde 2009</p>
            <div className="flex gap-4 mt-4">
              <FaFacebook className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-500" />
              <FaInstagram className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-pink-500" />
              <FaTwitter className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-400" />
              <FaLinkedin className="text-2xl cursor-pointer hover:scale-125 transition-transform text-gray-400 hover:text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Cursos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/fundamental2" className="hover:text-white transition-colors">Fundamental 2</Link></li>
              <li><Link href="/ensinomedio" className="hover:text-white transition-colors">Ensino Médio</Link></li>
              <li><Link href="/cursos-tecnicos" className="hover:text-white transition-colors">Cursos Técnicos</Link></li>
              <li><Link href="/in-company" className="hover:text-white transition-colors">In Company</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link href="/matriculas" className="hover:text-white transition-colors">Matrículas</Link></li>
              <li><Link href="/noticias" className="hover:text-white transition-colors">Notícias</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">contato@etpc.com.br</li>
              <li className="hover:text-white transition-colors cursor-pointer">(24) 3340-5412</li>
              <li className="hover:text-white transition-colors cursor-pointer">Volta Redonda, RJ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ETPC - Escola Técnica da Fundação CSN. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
