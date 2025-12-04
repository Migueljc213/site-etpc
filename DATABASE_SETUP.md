# Configuração do Banco de Dados ETPC

## 🗄️ Banco de Dados PostgreSQL + Prisma ORM

### 1. Instalação do PostgreSQL

#### Windows:
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Instale com as configurações padrão
3. Anote a senha do usuário `postgres` que você definiu

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configuração do Banco

1. **Criar banco de dados:**
```sql
-- Conectar como postgres
sudo -u postgres psql

-- Criar banco de dados
CREATE DATABASE etpc_db;

-- Criar usuário (opcional)
CREATE USER etpc_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE etpc_db TO etpc_user;

-- Sair
\q
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Database
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/etpc_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials (será criado pelo seed)
ADMIN_EMAIL=admin@etpc.com.br
ADMIN_PASSWORD=admin123
```

### 3. Configuração do Prisma

1. **Gerar cliente Prisma:**
```bash
npm run db:generate
```

2. **Aplicar migrações:**
```bash
npm run db:push
```

3. **Popular banco com dados iniciais:**
```bash
npm run db:seed
```

### 4. Verificar Configuração

1. **Abrir Prisma Studio:**
```bash
npm run db:studio
```

2. **Verificar dados:**
- Acesse http://localhost:5555
- Verifique se as tabelas foram criadas
- Confirme se os dados de seed foram inseridos

### 5. Estrutura do Banco

#### Tabelas Principais:
- **users** - Usuários do sistema (administradores)
- **news** - Notícias do site
- **categories** - Categorias de notícias
- **tags** - Tags para notícias
- **news_tags** - Relacionamento many-to-many
- **banners** - Banners promocionais
- **courses** - Cursos técnicos
- **course_modules** - Módulos dos cursos
- **course_subjects** - Disciplinas dos módulos
- **course_opportunities** - Oportunidades de carreira
- **course_labs** - Laboratórios dos cursos
- **site_configs** - Configurações do site
- **newsletter** - Inscrições na newsletter
- **contacts** - Contatos/leads
- **comments** - Comentários nas notícias

### 6. Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar mudanças no schema
npm run db:push

# Criar migração
npm run db:migrate

# Popular banco com dados
npm run db:seed

# Abrir interface visual
npm run db:studio

# Resetar banco (cuidado!)
npx prisma migrate reset
```

### 7. Dados Iniciais Criados

O script de seed cria:
- ✅ Usuário administrador (admin@etpc.com.br / admin123)
- ✅ 4 categorias (Notícias, Blog, Eventos, Matrículas)
- ✅ 5 tags (Educação, ETPC, Alunos, Sucesso, Cursos)
- ✅ 2 notícias de exemplo
- ✅ 2 banners de exemplo
- ✅ 1 curso completo com módulos, disciplinas, oportunidades e laboratórios
- ✅ Configurações básicas do site

### 8. Acesso ao Painel Administrativo

Após configurar o banco:
1. Acesse: http://localhost:3000/admin
2. Login: admin@etpc.com.br
3. Senha: admin123

### 9. Produção

Para produção, considere:
- Usar um serviço gerenciado (Supabase, PlanetScale, Railway)
- Configurar backups automáticos
- Usar variáveis de ambiente seguras
- Implementar monitoramento

### 10. Troubleshooting

#### Erro de conexão:
- Verifique se o PostgreSQL está rodando
- Confirme a string de conexão no .env.local
- Teste a conexão: `psql -h localhost -U postgres -d etpc_db`

#### Erro de permissão:
- Verifique se o usuário tem permissões no banco
- Execute: `GRANT ALL PRIVILEGES ON DATABASE etpc_db TO seu_usuario;`

#### Erro de schema:
- Execute: `npm run db:generate`
- Depois: `npm run db:push`

### 11. Backup e Restore

#### Backup:
```bash
pg_dump -h localhost -U postgres etpc_db > backup.sql
```

#### Restore:
```bash
psql -h localhost -U postgres etpc_db < backup.sql
```

---

🎉 **Pronto!** Seu banco de dados está configurado e funcionando!
