# Configuração do Banco de Dados MySQL + Prisma ORM

## 🗄️ Banco de Dados MySQL + Prisma ORM

### 1. Instalação do MySQL

#### Windows:
1. Baixe o MySQL em: https://dev.mysql.com/downloads/mysql/
2. Ou use o XAMPP: https://www.apachefriends.org/download.html
3. Instale com as configurações padrão
4. Anote a senha do usuário `root` que você definiu

#### macOS:
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### 2. Configuração do Banco

1. **Conectar ao MySQL:**
```bash
mysql -u root -p
```

2. **Criar banco de dados:**
```sql
-- Criar banco de dados
CREATE DATABASE etpc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (opcional)
CREATE USER 'etpc_user'@'localhost' IDENTIFIED BY 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON etpc_db.* TO 'etpc_user'@'localhost';
FLUSH PRIVILEGES;

-- Sair
EXIT;
```

3. **Configurar variáveis de ambiente:**
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Database MySQL
DATABASE_URL="mysql://root:sua_senha@localhost:3306/etpc_db"

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

### 5. Estrutura do Banco MySQL

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
- Usar um serviço gerenciado (PlanetScale, AWS RDS, Google Cloud SQL)
- Configurar backups automáticos
- Usar variáveis de ambiente seguras
- Implementar monitoramento

### 10. Troubleshooting

#### Erro de conexão:
- Verifique se o MySQL está rodando
- Confirme a string de conexão no .env.local
- Teste a conexão: `mysql -h localhost -u root -p`

#### Erro de permissão:
- Verifique se o usuário tem permissões no banco
- Execute: `GRANT ALL PRIVILEGES ON etpc_db.* TO 'seu_usuario'@'localhost';`

#### Erro de charset:
- Certifique-se de usar `utf8mb4` para suporte completo ao Unicode
- Verifique se o banco foi criado com: `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`

#### Erro de schema:
- Execute: `npm run db:generate`
- Depois: `npm run db:push`

### 11. Backup e Restore

#### Backup:
```bash
mysqldump -u root -p etpc_db > backup.sql
```

#### Restore:
```bash
mysql -u root -p etpc_db < backup.sql
```

### 12. Diferenças do PostgreSQL

#### Vantagens do MySQL:
- ✅ Mais comum em hospedagens compartilhadas
- ✅ Interface gráfica (phpMyAdmin, MySQL Workbench)
- ✅ Suporte nativo em XAMPP/WAMP
- ✅ Mais familiar para desenvolvedores web

#### Configurações Específicas:
- **Charset**: `utf8mb4` para suporte completo ao Unicode
- **Engine**: InnoDB (padrão) para transações
- **Timezone**: Configurar corretamente para timestamps

### 13. XAMPP (Recomendado para Desenvolvimento)

Se usar XAMPP:
1. Instale o XAMPP
2. Inicie Apache e MySQL
3. Acesse http://localhost/phpmyadmin
4. Crie o banco `etpc_db`
5. Configure a string de conexão:
   ```
   DATABASE_URL="mysql://root:@localhost:3306/etpc_db"
   ```

---

🎉 **Pronto!** Seu banco MySQL está configurado e funcionando!
