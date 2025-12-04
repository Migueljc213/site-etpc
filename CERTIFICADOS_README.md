# Sistema de Certificados - ETPC

## Implementação Completa

O sistema de certificados foi totalmente implementado e está funcional. Os alunos podem gerar certificados após completar todos os requisitos do curso.

## Como Funciona

### 1. Requisitos para Gerar Certificado

Para que um aluno possa gerar um certificado, ele precisa:

- ✅ Estar matriculado no curso
- ✅ Completar todas as aulas (100% de progresso)
- ✅ Ser aprovado em todas as provas obrigatórias dos módulos
- ✅ Ter o status da matrícula como "completed"

### 2. Fluxo de Geração

1. **Conclusão do Curso**: O aluno assiste todas as aulas e passa em todas as provas
2. **Status Atualizado**: A matrícula é marcada como "completed" automaticamente
3. **Geração do Certificado**: O sistema permite gerar o certificado através da API
4. **Número Único**: Cada certificado recebe um número único (formato: ETPC-XXXXX-XXXXX)

### 3. APIs Implementadas

#### GET /api/student/certificates
Lista todos os certificados do aluno autenticado.

**Resposta:**
```json
[
  {
    "id": "cert_id",
    "certificateNumber": "ETPC-12345-ABCDE",
    "issuedAt": "2024-01-15T10:00:00Z",
    "pdfUrl": null,
    "course": {
      "id": "course_id",
      "title": "Excel Avançado",
      "slug": "excel-avancado",
      "image": "https://...",
      "instructor": "Prof. João Silva",
      "duration": "40 horas"
    }
  }
]
```

#### POST /api/student/certificates/generate
Gera um novo certificado para uma matrícula específica.

**Request Body:**
```json
{
  "enrollmentId": "enrollment_id"
}
```

**Resposta (Sucesso):**
```json
{
  "message": "Certificado gerado com sucesso!",
  "certificate": {
    "id": "cert_id",
    "certificateNumber": "ETPC-12345-ABCDE",
    "issuedAt": "2024-01-15T10:00:00Z",
    "course": {
      "title": "Excel Avançado",
      "instructor": "Prof. João Silva",
      "duration": "40 horas"
    }
  }
}
```

**Resposta (Erro - Curso não concluído):**
```json
{
  "error": "Curso não concluído. Complete todas as aulas e provas."
}
```

**Resposta (Erro - Provas pendentes):**
```json
{
  "error": "Você precisa ser aprovado em todas as provas obrigatórias para gerar o certificado."
}
```

#### GET /api/certificates/[certificateNumber]
Busca os dados de um certificado pelo número para visualização pública.

**Resposta:**
```json
{
  "certificateNumber": "ETPC-12345-ABCDE",
  "issuedAt": "2024-01-15T10:00:00Z",
  "studentName": "João Silva",
  "studentEmail": "joao@email.com",
  "course": {
    "title": "Excel Avançado",
    "instructor": "Prof. João Silva",
    "duration": "40 horas"
  }
}
```

### 4. Páginas Implementadas

#### /dashboard/certificados
Página onde o aluno visualiza todos os seus certificados.

**Funcionalidades:**
- Lista todos os certificados emitidos
- Botão para visualizar o certificado
- Botão para baixar/imprimir como PDF
- Exibe número do certificado e data de emissão
- Link para a página de certificado

#### /certificado/[certificateNumber]
Página pública de visualização do certificado.

**Funcionalidades:**
- Design profissional e elegante
- Formatado para impressão em A4 paisagem
- Bordas decorativas
- Informações do aluno e curso
- Número único para verificação
- Botão de impressão/salvar PDF
- URL de verificação de autenticidade

### 5. Como Gerar um Certificado (Manualmente via API)

Para testar a geração de certificado, você pode usar o seguinte comando:

```bash
# 1. Primeiro, obtenha o enrollmentId do aluno
curl -X GET http://localhost:3000/api/student/enrollments \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# 2. Depois, gere o certificado
curl -X POST http://localhost:3000/api/student/certificates/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"enrollmentId": "ENROLLMENT_ID"}'
```

### 6. Estrutura do Banco de Dados

O modelo `Certificate` no Prisma:

```prisma
model Certificate {
  id                String   @id @default(cuid())
  enrollmentId      String   @unique
  enrollment        StudentEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  certificateNumber String   @unique // Número único do certificado
  issuedAt          DateTime @default(now())
  pdfUrl            String?  // URL do PDF gerado (futuro)

  @@index([certificateNumber])
  @@map("certificates")
}
```

### 7. Melhorias Futuras

Algumas melhorias que podem ser implementadas:

1. **Geração de PDF no Servidor**: Usar bibliotecas como `puppeteer` ou `jspdf` para gerar PDFs no servidor
2. **Upload para Cloud Storage**: Salvar PDFs em S3, Cloudinary ou outro serviço
3. **Assinatura Digital**: Adicionar assinatura digital aos certificados
4. **QR Code**: Adicionar QR code para verificação rápida
5. **Página de Verificação**: Criar página `/verificar/[certificateNumber]` para verificar autenticidade
6. **Notificação por Email**: Enviar email quando certificado for gerado
7. **Compartilhamento Social**: Permitir compartilhar certificado em redes sociais
8. **Histórico de Emissões**: Para administradores verem todos os certificados emitidos

### 8. Design do Certificado

O certificado possui:

- ✅ Bordas decorativas (dupla borda azul e cinza)
- ✅ Ícone de prêmio/medalha
- ✅ Título grande e profissional
- ✅ Nome do aluno em destaque
- ✅ Informações do curso
- ✅ Data de emissão
- ✅ Número único do certificado
- ✅ Assinatura da instituição
- ✅ URL de verificação
- ✅ Formatado para impressão A4 paisagem
- ✅ Responsivo e com boa visualização em tela

### 9. Segurança

- ✅ Autenticação obrigatória para gerar certificados
- ✅ Validação de propriedade (aluno só pode gerar seu próprio certificado)
- ✅ Verificação de conclusão do curso
- ✅ Números de certificado únicos e aleatórios
- ✅ Visualização pública apenas com número do certificado

## Teste Rápido

Para testar o sistema:

1. Faça login como aluno
2. Complete um curso (assista todas as aulas e passe nas provas)
3. Acesse `/dashboard/certificados`
4. Clique em "Visualizar" para ver o certificado
5. Use "Baixar PDF" para salvar uma cópia

Ou use a API diretamente para gerar um certificado de teste.
