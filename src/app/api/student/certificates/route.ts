import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userEmail = session.user.email!;

    // Buscar certificados do aluno
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentEmail: userEmail,
        status: 'completed'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            instructor: true,
            duration: true
          }
        },
        certificate: true
      }
    });

    // Filtrar apenas matrículas com certificado
    const certificatesWithCourse = enrollments
      .filter(e => e.certificate)
      .map(e => ({
        id: e.certificate!.id,
        certificateNumber: e.certificate!.certificateNumber,
        issuedAt: e.certificate!.issuedAt,
        pdfUrl: e.certificate!.pdfUrl,
        course: e.course
      }));

    return NextResponse.json(certificatesWithCourse);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Erro ao buscar certificados' }, { status: 500 });
  }
}


