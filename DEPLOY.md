# Deploy na Vercel - ETPC

## Configuração das Variáveis de Ambiente

Configure as seguintes variáveis de ambiente na Vercel:

### 1. Database
```
DATABASE_URL=mysql://username:password@host:port/database
```

### 2. NextAuth
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Ambiente
```
NODE_ENV=production
```

## Passos para Deploy

1. **Conectar repositório GitHub** na Vercel
2. **Configurar variáveis de ambiente** (acima)
3. **Deploy automático** será executado
4. **Verificar logs** se houver erros

## Comandos de Build

O projeto usa os seguintes comandos:
- `npm run build` - Gera Prisma Client + Build Next.js
- `npm run postinstall` - Gera Prisma Client após instalação

## Troubleshooting

### Erro: "An unexpected internal error occurred"
- Verificar se todas as variáveis de ambiente estão configuradas
- Verificar se o banco MySQL está acessível
- Verificar logs de build na Vercel

### Erro: Prisma Client não encontrado
- O comando `postinstall` deve gerar o cliente automaticamente
- Verificar se `prisma generate` está sendo executado

### Erro: NextAuth
- Verificar se `NEXTAUTH_URL` está correto
- Verificar se `NEXTAUTH_SECRET` está definido
