# MultiFileUpload Component

Componente reutilizável para upload de múltiplas fotos com interface moderna e intuitiva.

## Características

- ✅ **Botão personalizado** em vez de input padrão
- ✅ **Preview das imagens** selecionadas
- ✅ **Drag & Drop** para arrastar arquivos
- ✅ **Remoção individual** de arquivos
- ✅ **Limpeza em lote** de todos os arquivos
- ✅ **Validação de tipos** de arquivo
- ✅ **Limite de arquivos** configurável
- ✅ **Informações detalhadas** (nome, tamanho)
- ✅ **Interface responsiva**

## Uso Básico

```tsx
import MultiFileUpload from '@/components/MultiFileUpload';

function MyComponent() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <MultiFileUpload
      onFilesChange={handleFilesChange}
      accept="image/*"
      multiple={true}
      maxFiles={10}
      label="Selecionar Fotos"
      placeholder="Clique para selecionar fotos ou arraste aqui"
    />
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onFilesChange` | `(files: File[]) => void` | - | Callback chamado quando arquivos mudam |
| `accept` | `string` | `"image/*"` | Tipos de arquivo aceitos |
| `multiple` | `boolean` | `true` | Permitir múltiplos arquivos |
| `maxFiles` | `number` | `10` | Número máximo de arquivos |
| `className` | `string` | `""` | Classes CSS adicionais |
| `label` | `string` | `"Selecionar Fotos"` | Texto do botão |
| `placeholder` | `string` | `"Clique para selecionar arquivos ou arraste aqui"` | Texto de ajuda |

## Exemplos de Uso

### Upload de Fotos para Galeria
```tsx
<MultiFileUpload
  onFilesChange={handleFilesChange}
  accept="image/*"
  multiple={true}
  maxFiles={20}
  label="Selecionar Fotos"
  placeholder="Clique para selecionar fotos ou arraste aqui"
/>
```

### Upload de Documentos
```tsx
<MultiFileUpload
  onFilesChange={handleFilesChange}
  accept=".pdf,.doc,.docx"
  multiple={true}
  maxFiles={5}
  label="Selecionar Documentos"
  placeholder="Arraste documentos aqui"
/>
```

### Upload Único
```tsx
<MultiFileUpload
  onFilesChange={handleFilesChange}
  accept="image/*"
  multiple={false}
  maxFiles={1}
  label="Selecionar Foto"
  placeholder="Clique para selecionar uma foto"
/>
```

## Integração com Formulários

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (files.length === 0) {
    alert('Selecione pelo menos um arquivo');
    return;
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('category', category);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    toast.success('Arquivos enviados com sucesso!');
    setFiles([]); // Limpar arquivos após sucesso
  }
};
```

## Estilização

O componente usa classes Tailwind CSS e pode ser customizado:

```tsx
<MultiFileUpload
  onFilesChange={handleFilesChange}
  className="my-custom-class"
  // ... outras props
/>
```

## Acessibilidade

- ✅ Suporte a leitores de tela
- ✅ Navegação por teclado
- ✅ Indicadores visuais claros
- ✅ Mensagens de erro descritivas
