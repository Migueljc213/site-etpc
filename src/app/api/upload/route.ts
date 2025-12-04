import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar nome único para o arquivo
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    
    // Definir pasta baseada no tipo
    let folder = 'general'
    if (type === 'news') folder = 'noticias'
    if (type === 'banner') folder = 'banners'
    
    // Caminho para salvar o arquivo
    const path = join(process.cwd(), 'public', 'images', folder, fileName)
    
    // Salvar o arquivo
    await writeFile(path, buffer)
    
    // Retornar o caminho público
    const publicPath = `/images/${folder}/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      fileName: fileName
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
