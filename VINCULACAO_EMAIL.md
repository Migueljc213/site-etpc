# Sistema de Vinculação de Cursos por Email

## 📋 Visão Geral

Este documento explica como funciona o sistema de vinculação automática de cursos por email, permitindo que alunos comprem cursos sem estar autenticados e acessem os cursos após se cadastrarem com o mesmo email.

## 🔄 Fluxo Completo

### 1. Compra sem Autenticação

```
Cliente preenche checkout
  ↓
[order.customerEmail = "cliente@email.com"]
  ↓
Pedido criado no banco com email
  ↓
Pagamento processado
  ↓
Status: "pending" (aguardando aprovação)
```

### 2. Aprovação do Pagamento (via Webhook)

```
Mercado Pago envia webhook
  ↓
Webhook atualiza status para "paid"
  ↓
Cria automaticamente: student_enrollments
  ↓
[studentEmail = "cliente@email.com"]
[courseId = ID do curso comprado]
[status = "active"]
```

### 3. Cadastro/Login do Aluno

```
Aluno acessa /cadastro ou /login
  ↓
Informa o mesmo email usado na compra
  ↓
Sistema cria/autentica conta
  ↓
Redireciona para /meus-cursos
  ↓
API busca cursos por studentEmail
  ↓
Exibe todos os cursos vinculados ao email
```

## 📊 Arquitetura de Dados

### Modelo Order

```prisma
model Order {
  id              String
  customerEmail   String  // ← Email do comprador
  customerName    String
  status          String
  // ...
  items           OrderItem[]
}
```

### Modelo StudentEnrollment

```prisma
model StudentEnrollment {
  id                String
  studentEmail      String  // ← Vinculado por EMAIL (não por user.id)
  courseId          String
  course            OnlineCourse
  status            String  // active, completed, expired
  enrolledAt        DateTime
}
```

### Chave Única

```prisma
@@unique([studentEmail, courseId])
```

Isso garante que:
- Um aluno não pode estar matriculado duas vezes no mesmo curso
- O sistema usa EMAIL como identificador principal

## 🎯 Código Relevante

### Webhook Handler (`src/app/api/webhooks/mercadopago/route.ts`)

```typescript
// Quando pagamento é aprovado
if (newStatus === 'paid' && order.items.length > 0) {
  for (const item of order.items) {
    await prisma.studentEnrollment.upsert({
      where: {
        studentEmail_courseId: {
          studentEmail: order.customerEmail, // ← Email da compra
          courseId: item.course.id
        }
      },
      update: { status: 'active' },
      create: {
        studentEmail: order.customerEmail,
        courseId: item.course.id,
        status: 'active',
        enrolledAt: new Date()
      }
    });
  }
}
```

### API de Cursos do Aluno (`src/app/api/student/courses/route.ts`)

```typescript
export async function GET(request: NextRequest) {
  const email = searchParams.get('email'); // ← Email da sessão
  
  // Buscar matrículas por EMAIL
  const enrollments = await prisma.studentEnrollment.findMany({
    where: {
      studentEmail: email,
      status: 'active'
    },
    include: { course: true }
  });
  
  // Retornar cursos com progresso
  return NextResponse.json(enrollments);
}
```

### Checkout (`src/app/checkout/page.tsx`)

```typescript
// Captura email do comprador
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({
    customerName: customerData.name,
    customerEmail: customerData.email, // ← Email será usado para matrícula
    // ...
  })
});
```

## ✅ Garantias do Sistema

1. **Email Único**: Mesmo email = mesmo aluno
2. **Automatizado**: Matrículas criadas via webhook
3. **Seguro**: Chave composta `@@unique([studentEmail, courseId])` previne duplicatas
4. **Flexível**: Aluno não precisa estar autenticado para comprar
5. **Rastreável**: Todas as matrículas vinculadas ao email

## 🔍 Debug

Para verificar se o sistema está funcionando:

1. Faça uma compra sem login
2. Aguarde webhook do Mercado Pago
3. Verifique se `student_enrollments` foi criada:
   ```sql
   SELECT * FROM student_enrollments WHERE studentEmail = 'email@exemplo.com';
   ```
4. Faça login/cadastro com o mesmo email
5. Acesse `/meus-cursos` e verifique se os cursos aparecem

## 📝 Logs de Debug

O webhook agora inclui logs detalhados:

```
📝 Criando matrículas para pedido ORD-xxxxx, email: cliente@email.com
📚 Itens do pedido: [{ courseId: "...", course: "Nome do Curso" }]
✅ Criando matrícula: email=cliente@email.com, courseId=xxx
✅ Matrícula criada/atualizada com sucesso para curso Nome do Curso
✅ Student enrollments created for order ORD-xxxxx
```

## 🎓 Casos de Uso

### Caso 1: Compra Anônima → Cadastro
1. Cliente compra curso com email@exemplo.com
2. Cliente se cadastra com o mesmo email
3. **Resultado**: Curso aparece no painel automaticamente

### Caso 2: Compra Anônima → Login Existente
1. Cliente já tem conta com email@exemplo.com
2. Cliente compra curso sem fazer login
3. Cliente faz login depois
4. **Resultado**: Curso aparece no painel automaticamente

### Caso 3: Múltiplos Cursos
1. Cliente compra 3 cursos com o mesmo email
2. Todos são vinculados ao email
3. Quando login/cadastro: todos aparecem
4. **Resultado**: Painel mostra todos os 3 cursos

## 🚀 Resultado Final

- ✅ Compra sem autenticação funciona
- ✅ Email é usado como identificador
- ✅ Matrículas criadas via webhook
- ✅ Cursos aparecem automaticamente após login
- ✅ Sistema robusto e automático

