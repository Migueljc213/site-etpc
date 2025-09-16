# 🗄️ Guia de Configuração MySQL - ETPC

## 📋 Checklist de Configuração

### ✅ 1. Instalar MySQL
- [ ] MySQL 8.0+ instalado
- [ ] Serviço MySQL rodando
- [ ] Usuário root configurado

### ✅ 2. Configurar Banco de Dados
- [ ] Banco `etpc_db` criado
- [ ] Charset `utf8mb4` configurado
- [ ] Usuário com permissões (opcional)

### ✅ 3. Configurar Projeto
- [ ] Arquivo `.env.local` criado
- [ ] String de conexão configurada
- [ ] Dependências instaladas

### ✅ 4. Aplicar Schema
- [ ] Cliente Prisma gerado
- [ ] Schema aplicado ao banco
- [ ] Dados iniciais inseridos

## 🚀 Comandos de Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco MySQL
```sql
-- Conectar ao MySQL
mysql -u root -p

-- Criar banco de dados
CREATE DATABASE etpc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar se foi criado
SHOW DATABASES;

-- Sair
EXIT;
```

### 3. Configurar Variáveis de Ambiente
Crie `.env.local`:
```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/etpc_db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-key-aqui
```

### 4. Aplicar Schema
```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

### 5. Executar Projeto
```bash
npm run dev
```

## 🔍 Verificações

### ✅ Banco de Dados
```sql
-- Verificar tabelas criadas
USE etpc_db;
SHOW TABLES;

-- Verificar dados
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM news;
```

### ✅ Aplicação
- [ ] Site carregando em http://localhost:3000
- [ ] Painel admin acessível em http://localhost:3000/admin
- [ ] Login funcionando (admin@etpc.com.br / admin123)
- [ ] Notícias sendo exibidas
- [ ] CRUD funcionando no painel

## 🛠️ Troubleshooting

### ❌ Erro de Conexão
```
Error: Can't connect to MySQL server
```
**Solução:**
1. Verificar se MySQL está rodando
2. Confirmar string de conexão
3. Testar conexão: `mysql -u root -p`

### ❌ Erro de Permissão
```
Access denied for user 'root'@'localhost'
```
**Solução:**
1. Verificar senha do root
2. Criar usuário específico:
```sql
CREATE USER 'etpc_user'@'localhost' IDENTIFIED BY 'senha';
GRANT ALL PRIVILEGES ON etpc_db.* TO 'etpc_user'@'localhost';
FLUSH PRIVILEGES;
```

### ❌ Erro de Charset
```
Incorrect string value
```
**Solução:**
1. Recriar banco com charset correto:
```sql
DROP DATABASE etpc_db;
CREATE DATABASE etpc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Erro de Schema
```
Prisma schema not found
```
**Solução:**
1. Executar: `npm run db:generate`
2. Depois: `npm run db:push`

## 📊 Estrutura Final

Após configuração, você terá:

### 🗄️ Banco de Dados
- **14 tabelas** criadas
- **Dados iniciais** inseridos
- **Relacionamentos** configurados
- **Índices** otimizados

### 🌐 Aplicação
- **Site público** funcionando
- **Painel administrativo** ativo
- **APIs REST** funcionais
- **Autenticação** segura

### 📱 Funcionalidades
- **CRUD completo** de notícias
- **CRUD completo** de banners
- **CRUD completo** de cursos
- **Sistema de configurações**
- **Páginas responsivas**

## 🎯 Próximos Passos

1. **Testar todas as funcionalidades**
2. **Personalizar conteúdo**
3. **Configurar domínio**
4. **Fazer backup do banco**
5. **Configurar monitoramento**

---

🎉 **MySQL configurado com sucesso!**
