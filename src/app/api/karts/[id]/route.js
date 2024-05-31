import { NextResponse } from "next/server"; 
import prisma from '@/libs/db'

// Controlador para actualizar un carrito específico por su ID
export async function PUT(request, { params }) {
    const { id } = params;
    const { idproduct, title, image, description, price, amount, user } = await request.json();
  
    try {
      const updatedKart = await prisma.kart.update({
        where: { id: parseInt(id) },
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
  
      return NextResponse.json(updatedKart);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error al actualizar el carrito' },
        { status: 500 }
      );
    }
  }

export async function DELETE(request, { params }) {
    const { id } = params;
  
    try {
      const deletedKart = await prisma.kart.delete({
        where: { id: parseInt(id) },
      });
  
      return NextResponse.json(deletedKart);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error al eliminar el carrito' },
        { status: 500 }
      );
    }
  }
