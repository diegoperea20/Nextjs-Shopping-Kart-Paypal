import { NextResponse } from 'next/server';
import prisma from '@/libs/db';

// Manejar el método POST para crear un nuevo registro de Store
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, image, description, price } = body;

    const store = await prisma.store.create({
      data: {
        title,
        image,
        description,
        price
      }
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating store entry' }, { status: 500 });
  }
}

// Manejar el método GET para obtener todos los registros de Store
export async function GET() {
  try {
    const stores = await prisma.store.findMany();
    return NextResponse.json(stores, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching store entries' }, { status: 500 });
  }
}
