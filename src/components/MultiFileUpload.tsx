'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface FileWithPreview {
  file: File;
  id: string;
  preview: string;
}

interface MultiFileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  label?: string;
  placeholder?: string;
}

export default function MultiFileUpload({
  onFilesChange,
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  className = "",
  label = "Selecionar Fotos",
  placeholder = "Clique para selecionar arquivos ou arraste aqui"
}: MultiFileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: FileWithPreview[] = [];
    
    Array.from(files).forEach((file) => {
      if (selectedFiles.length + newFiles.length >= maxFiles) return;
      
      // Verificar se o arquivo já foi selecionado
      const isDuplicate = selectedFiles.some(f => f.file.name === file.name && f.file.size === file.size);
      if (isDuplicate) return;

      const fileWithPreview: FileWithPreview = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      };
      
      newFiles.push(fileWithPreview);
    });

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    const fileToRemove = selectedFiles.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = selectedFiles.filter(f => f.id !== id);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
  };

  const clearAllFiles = () => {
    selectedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    onFilesChange([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de Upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-etpc-blue bg-blue-50'
            : 'border-gray-300 hover:border-etpc-blue hover:bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <FaUpload className="text-4xl text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
          <p className="text-sm text-gray-500">{placeholder}</p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-400 mt-1">
              Máximo {maxFiles} arquivos
            </p>
          )}
        </div>
      </div>

      {/* Lista de Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Arquivos Selecionados ({selectedFiles.length})
            </h4>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <FaTrash className="text-xs" />
              Limpar todos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedFiles.map((fileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {/* Preview da Imagem */}
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Informações do Arquivo */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-900 truncate" title={fileWithPreview.file.name}>
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileWithPreview.file.size)}
                  </p>
                </div>

                {/* Botão de Remover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileWithPreview.id);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover arquivo"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
