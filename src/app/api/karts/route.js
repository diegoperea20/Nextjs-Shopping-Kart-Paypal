import { NextResponse } from "next/server"; 
import prisma from '@/libs/db'

export async function POST(request) {
  const { idproduct, title, image, description, price, amount, user } = await request.json();

  try {
    const newKart = await prisma.kart.create({
      data: {
        idproduct,
        title,
        image,
        description,
        price,
        amount,
        user,
      },
    });

    return NextResponse.json(newKart);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al crear el carrito' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const karts = await prisma.kart.findMany();
    return NextResponse.json(karts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los carritos" }, { status: 500 });
  }
}
