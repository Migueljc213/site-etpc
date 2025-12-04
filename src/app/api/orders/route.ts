import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar pedidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (email) {
      where.customerEmail = email;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            course: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar dados obrigatórios
    if (!data.customerName || !data.customerEmail || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Buscar os cursos para calcular os valores
    const courseIds = data.items.map((item: any) => item.courseId);
    const courses = await prisma.onlineCourse.findMany({
      where: {
        id: {
          in: courseIds
        }
      }
    });

    if (courses.length !== courseIds.length) {
      return NextResponse.json(
        { error: 'Alguns cursos não foram encontrados' },
        { status: 404 }
      );
    }

    // Calcular subtotal
    let subtotal = 0;
    const orderItems = data.items.map((item: any) => {
      const course = courses.find(c => c.id === item.courseId);
      if (!course) throw new Error('Curso não encontrado');

      const price = course.discountPrice || course.price;
      const itemSubtotal = Number(price) * (item.quantity || 1);
      subtotal += itemSubtotal;

      return {
        courseId: item.courseId,
        quantity: item.quantity || 1,
        price: price,
        subtotal: itemSubtotal
      };
    });

    const discount = data.discount || 0;
    const total = subtotal - discount;

    // Gerar número do pedido único
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `ORD-${dateStr}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let orderNumber;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[2]);
      orderNumber = `ORD-${dateStr}-${String(lastNumber + 1).padStart(4, '0')}`;
    } else {
      orderNumber = `ORD-${dateStr}-0001`;
    }

    // Criar pedido com itens
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        customerCPF: data.customerCPF || null,
        subtotal,
        discount,
        total,
        paymentMethod: data.paymentMethod || null,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            course: true
          }
        }
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
