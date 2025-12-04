# Painel Administrativo ETPC

## Configuração do Painel Administrativo

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials
ADMIN_EMAIL=admin@etpc.com.br
ADMIN_PASSWORD=admin123

# Database (if using a real database)
# DATABASE_URL=your-database-url-here
```

### 2. Instalação de Dependências

```bash
npm install next-auth bcryptjs
```

### 3. Acesso ao Painel

- **URL**: `http://localhost:3000/admin`
- **Login**: `admin@etpc.com.br`
- **Senha**: `admin123`

### 4. Funcionalidades Disponíveis

#### Dashboard
- Visão geral das estatísticas do site
- Ações rápidas para criar conteúdo
- Atividade recente
- Status do sistema

#### Gerenciamento de Notícias
- Criar, editar e excluir notícias
- Categorizar notícias (Notícias, Blog, Eventos, Matrículas)
- Destacar notícias importantes
- Controlar publicação (rascunho/publicado)
- Preview em tempo real

#### Gerenciamento de Banners
- Criar, editar e excluir banners
- Definir posições (homepage-top, homepage-middle, etc.)
- Controlar período de exibição
- Ativar/desativar banners

#### Gerenciamento de Cursos
- Criar, editar e excluir cursos técnicos
- Gerenciar módulos e disciplinas
- Configurar informações financeiras
- Controlar visibilidade dos cursos

#### Configurações
- Informações básicas do site
- Redes sociais
- Configurações de SEO
- Dados de contato

### 5. Segurança

- Autenticação obrigatória para acesso
- Sessões seguras com JWT
- Proteção de rotas administrativas
- Validação de permissões

### 6. Próximos Passos

Para produção, considere:

1. **Banco de Dados Real**: Integrar com PostgreSQL, MySQL ou MongoDB
2. **Upload de Imagens**: Implementar sistema de upload para banners e notícias
3. **Backup Automático**: Configurar backup regular dos dados
4. **Logs de Auditoria**: Registrar todas as ações administrativas
5. **Múltiplos Usuários**: Sistema de usuários com diferentes níveis de acesso
6. **API Externa**: Integração com sistemas externos se necessário

### 7. Estrutura de Arquivos

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Layout do painel admin
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/page.tsx      # Página de login
│   │   ├── noticias/           # CRUD de notícias
│   │   ├── banners/            # CRUD de banners
│   │   ├── cursos/             # CRUD de cursos
│   │   └── configuracoes/      # Configurações gerais
│   └── api/auth/[...nextauth]/ # Configuração NextAuth
├── components/
│   └── providers/
│       └── SessionProvider.tsx # Provider de autenticação
├── lib/
│   └── auth.ts                 # Configuração de autenticação
└── types/
    └── next-auth.d.ts          # Tipos TypeScript para NextAuth
```

### 8. Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

### 9. Suporte

Para dúvidas ou problemas, consulte a documentação do NextAuth.js ou entre em contato com o desenvolvedor.
