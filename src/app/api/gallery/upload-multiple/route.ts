import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Temporariamente removendo autenticação para debug
    console.log('Upload API called');
    
    // const session = await getServerSession(authOptions);
    
    // if (!session?.user) {
    //   console.log('No session found');
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // console.log('Session found:', session.user.email);

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'geral';

    console.log('Files received:', files.length);
    console.log('Category:', category);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'gallery');
    
    // Criar diretório se não existir
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      console.log('Directory already exists or created successfully');
    }

    const uploadedPhotos = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        console.log(`Processing file ${i}:`, file?.name, file?.type);
        
        if (!file || !file.type.startsWith('image/')) {
          console.log(`Skipping invalid file: ${file?.name || 'unknown'}`);
          continue; // Pular arquivos que não são imagens
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
        const filePath = path.join(uploadDir, filename);
        
        await writeFile(filePath, buffer);

        const publicPath = `/images/gallery/${filename}`;

        // Salvar no banco de dados
        const photo = await prisma.galleryPhoto.create({
          data: {
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extensão
            description: `Foto adicionada em ${new Date().toLocaleDateString('pt-BR')}`,
            image: publicPath,
            category,
            order: i,
            active: true
          }
        });

        uploadedPhotos.push(photo);
        console.log(`Successfully uploaded: ${filename}`);
      } catch (fileError) {
        console.error(`Error processing file ${i}:`, fileError);
        // Continue com os outros arquivos mesmo se um falhar
      }
    }

    return NextResponse.json({ 
      message: `${uploadedPhotos.length} fotos enviadas com sucesso`,
      photos: uploadedPhotos 
    });
  } catch (error) {
    console.error('Error uploading multiple photos:', error);
    return NextResponse.json({ error: 'Failed to upload photos' }, { status: 500 });
  }
}
