# Guia de Correção de Matrículas (Enrollments)

## 📋 Problema Identificado

Alguns pagamentos foram processados com status `paid` no banco de dados, mas as matrículas dos cursos não foram criadas automaticamente na tabela `student_enrollments`. Isso resultava em:

- ✅ Pagamento aprovado e registrado
- ✅ Pedido marcado como `paid`
- ❌ Cursos não aparecendo em "Meus Cursos" para o aluno

## 🔍 Causa Raiz

O problema ocorria em dois cenários:

1. **Modo Desenvolvimento/Teste com Cartão**: Quando pagamentos por cartão eram processados em modo mock (desenvolvimento), o status era definido como `paid` imediatamente, mas as matrículas não eram criadas porque o código esperava que o webhook do Mercado Pago fizesse isso.

2. **Webhook não executado**: Em alguns casos, se o webhook falhasse ou não fosse chamado, as matrículas não eram criadas mesmo com pagamento aprovado.

## ✅ Solução Implementada

### 1. Correção Imediata - Script de Correção

Criamos um script que verifica todos os pagamentos com status `paid` e cria as matrículas faltantes:

```bash
npx tsx scripts/fix-enrollments.ts
```

**O que o script faz:**
- ✅ Busca todos os pagamentos com status `paid`
- ✅ Verifica quais matrículas já existem
- ✅ Cria as matrículas faltantes
- ✅ Define data de expiração baseada em `validityDays` do curso
- ✅ Exibe relatório detalhado

**Resultado da última execução:**
```
📊 RESUMO:
   ✅ Matrículas criadas: 3
   ℹ️  Já existentes: 11
   ❌ Erros: 0
   📦 Total de pagamentos processados: 8
```

### 2. Correção Preventiva - Código Ajustado

Modificamos o arquivo `src/app/api/payments/process/route.ts` para criar matrículas imediatamente quando o pagamento é aprovado na hora (modo teste/desenvolvimento):

**Antes:**
```typescript
// NOTA: As matrículas serão criadas automaticamente pelo webhook quando o pagamento for aprovado
return NextResponse.json(payment, { status: 201 });
```

**Depois:**
```typescript
// Se o pagamento foi aprovado imediatamente (ex: modo teste com cartão),
// criar as matrículas agora ao invés de esperar pelo webhook
if (paymentData.status === 'paid' && orderWithItems) {
  console.log('💳 Pagamento aprovado imediatamente - criando matrículas...');
  // ... cria matrículas ...
}
```

### 3. Endpoint Admin de Correção

Criamos um endpoint de API para verificar e corrigir matrículas via interface administrativa:

**Verificar Status:**
```bash
GET /api/admin/fix-enrollments
```

Retorna:
```json
{
  "paidPaymentsCount": 8,
  "activeEnrollments": 14,
  "missingEnrollments": 0,
  "needsFix": false
}
```

**Corrigir Matrículas:**
```bash
POST /api/admin/fix-enrollments
```

Retorna:
```json
{
  "success": true,
  "summary": {
    "totalPayments": 8,
    "enrollmentsCreated": 3,
    "alreadyExisting": 11,
    "errors": 0
  },
  "details": [...]
}
```

## 🔄 Fluxo Completo Atualizado

### Pagamento PIX/Boleto:
```
Cliente finaliza compra
  ↓
Pagamento criado com status 'pending'
  ↓
Cliente paga
  ↓
Webhook recebe notificação
  ↓
Pagamento atualizado para 'paid'
  ↓
Matrículas criadas pelo webhook ✅
```

### Pagamento Cartão (Modo Teste):
```
Cliente finaliza compra
  ↓
Pagamento criado com status 'paid' (mock)
  ↓
Matrículas criadas IMEDIATAMENTE ✅
  ↓
(Webhook também cria se chamado - upsert evita duplicatas)
```

### Pagamento Cartão (Produção):
```
Cliente finaliza compra
  ↓
Pagamento processado pelo Mercado Pago
  ↓
Status retornado ('approved', 'pending', etc)
  ↓
Se 'approved': Matrículas criadas IMEDIATAMENTE ✅
  ↓
Webhook confirma e atualiza (upsert seguro)
```

## 🛠️ Como Usar o Script de Correção

### Quando usar:
- Após identificar que um cliente pagou mas não tem acesso aos cursos
- Para correção em lote de pagamentos antigos
- Para verificação periódica de integridade dos dados

### Como executar:

```bash
# Via Terminal
npx tsx scripts/fix-enrollments.ts

# Ou via API (requer autenticação admin)
curl -X POST https://seu-dominio.com/api/admin/fix-enrollments \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Segurança:
- ✅ Script usa `upsert` - não cria duplicatas
- ✅ Verifica matrículas existentes antes de criar
- ✅ Endpoint API requer autenticação de administrador
- ✅ Logs detalhados de todas as operações

## 📊 Verificação Manual no Banco

Para verificar manualmente se há pagamentos sem matrículas:

```sql
-- Buscar pagamentos pagos
SELECT 
  p.id, 
  p.status, 
  o.orderNumber, 
  o.customerEmail,
  o.paymentStatus
FROM payments p
JOIN orders o ON o.id = p.orderId
WHERE p.status = 'paid';

-- Buscar matrículas de um email específico
SELECT 
  e.id,
  e.studentEmail,
  c.title as courseTitle,
  e.status,
  e.enrolledAt,
  e.expiresAt
FROM student_enrollments e
JOIN online_courses c ON c.id = e.courseId
WHERE e.studentEmail = 'email@exemplo.com';

-- Identificar pagamentos pagos SEM matrículas
SELECT 
  o.orderNumber,
  o.customerEmail,
  oi.courseId,
  c.title as courseTitle,
  p.status as paymentStatus
FROM payments p
JOIN orders o ON o.id = p.orderId
JOIN order_items oi ON oi.orderId = o.id
JOIN online_courses c ON c.id = oi.courseId
LEFT JOIN student_enrollments e ON e.studentEmail = o.customerEmail AND e.courseId = c.id
WHERE p.status = 'paid' AND e.id IS NULL;
```

## 🎯 Teste de Funcionamento

Para testar se o problema foi resolvido:

1. **Fazer uma compra teste:**
   ```
   - Ir em /cursos-online
   - Adicionar curso ao carrinho
   - Fazer checkout com cartão (modo teste)
   ```

2. **Verificar logs:**
   ```
   💳 Pagamento aprovado imediatamente - criando matrículas...
   ✅ Matrícula criada: email@teste.com -> Nome do Curso
   ```

3. **Verificar dashboard:**
   ```
   - Login com o email usado na compra
   - Acessar /dashboard
   - Verificar se o curso aparece em "Meus Cursos"
   ```

## 📝 Histórico de Correções

### 28/10/2025
- ✅ Executado script de correção
- ✅ 3 matrículas criadas com sucesso
- ✅ Código ajustado para prevenir problema no futuro
- ✅ Endpoint de correção criado para administradores

## 🔗 Arquivos Relacionados

- `scripts/fix-enrollments.ts` - Script de correção em lote
- `src/app/api/admin/fix-enrollments/route.ts` - Endpoint de correção
- `src/app/api/payments/process/route.ts` - Processamento de pagamento (corrigido)
- `src/app/api/webhooks/mercadopago/route.ts` - Webhook do Mercado Pago
- `src/app/api/student/courses/route.ts` - API de cursos do aluno
- `src/app/dashboard/page.tsx` - Dashboard do aluno

## 💡 Prevenção Futura

O sistema agora tem **dupla proteção**:

1. **Criação Imediata**: Quando pagamento é aprovado na hora
2. **Criação via Webhook**: Quando Mercado Pago notifica aprovação
3. **Upsert Seguro**: Evita duplicatas em ambos os casos
4. **Script de Correção**: Para casos excepcionais

Com essas mudanças, o problema não deve mais ocorrer! 🎉

