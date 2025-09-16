# ETPC - Sistema Completo com MySQL

## 🚀 Configuração Rápida para MySQL

### 1. Pré-requisitos
- Node.js 18+
- MySQL 8.0+ ou XAMPP
- npm ou yarn

### 2. Instalação

```bash
# Clone o projeto
git clone [seu-repositorio]
cd etpc

# Instalar dependências
npm install

# Configurar banco MySQL
# 1. Crie um banco chamado 'etpc_db' no MySQL
# 2. Configure as variáveis de ambiente
```

### 3. Configuração do Banco

#### Opção A: MySQL Standalone
```sql
-- Conectar ao MySQL
mysql -u root -p

-- Criar banco
CREATE DATABASE etpc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sair
EXIT;
```

#### Opção B: XAMPP (Recomendado)
1. Instale o XAMPP
2. Inicie Apache e MySQL
3. Acesse http://localhost/phpmyadmin
4. Crie o banco `etpc_db`

### 4. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database MySQL
DATABASE_URL="mysql://root:@localhost:3306/etpc_db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-key-aqui

# Admin Credentials
ADMIN_EMAIL=admin@etpc.com.br
ADMIN_PASSWORD=admin123
```

### 5. Configuração do Banco

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

### 6. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Acessar o site
http://localhost:3000

# Acessar painel admin
http://localhost:3000/admin
# Login: admin@etpc.com.br
# Senha: admin123
```

### 7. Comandos Úteis

```bash
# Ver dados no banco
npm run db:studio

# Aplicar mudanças no schema
npm run db:push

# Resetar banco (cuidado!)
npx prisma migrate reset
```

## 📊 Funcionalidades Implementadas

### ✅ Sistema Completo
- **Painel Administrativo** com autenticação
- **CRUD de Notícias** com categorias e tags
- **CRUD de Banners** promocionais
- **CRUD de Cursos** técnicos completos
- **Sistema de Configurações** dinâmicas
- **Páginas Públicas** responsivas

### ✅ Banco de Dados
- **MySQL** com Prisma ORM
- **Schema completo** com relacionamentos
- **Dados iniciais** pré-carregados
- **APIs REST** completas

### ✅ Frontend
- **Next.js 15** com React 19
- **Tailwind CSS** para estilização
- **Responsivo** até 320px
- **Design moderno** e profissional

## 🎯 Estrutura do Projeto

```
etpc/
├── src/
│   ├── app/
│   │   ├── admin/          # Painel administrativo
│   │   ├── api/            # APIs REST
│   │   ├── noticias/       # Página de notícias
│   │   ├── noticia/[id]/   # Detalhes da notícia
│   │   └── ...             # Outras páginas
│   ├── components/         # Componentes reutilizáveis
│   └── lib/               # Configurações e utilitários
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Dados iniciais
└── public/                # Arquivos estáticos
```

## 🔧 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados
- **NextAuth.js** - Autenticação
- **bcryptjs** - Hash de senhas

## 📱 Responsividade

- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)
- **Design adaptativo** em todas as telas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Use um banco MySQL em produção (PlanetScale, AWS RDS)

### Outras Opções
- Netlify
- Railway
- DigitalOcean
- AWS

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Prisma
2. Consulte os logs de erro
3. Verifique a conexão com o MySQL
4. Confirme as variáveis de ambiente

---

🎉 **Sistema ETPC pronto para uso com MySQL!**
