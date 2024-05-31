import { NextResponse } from 'next/server';
import prisma from '@/libs/db';

// Manejar el método GET para obtener un registro específico de Store por ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const store = await prisma.store.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching store entry' }, { status: 500 });
  }
}
