import { NextResponse } from "next/server"; 
import prisma from '@/libs/db'


// Controlador para obtener todas los kats de un usuario específico
export async function GET(request, { params }) {
    const { user } = params;
  
    try {
      const karts = await prisma.kart.findMany({
        where: { user },
      });
  
      // Si no se encuentran karts, devolver un arreglo vacío
      return NextResponse.json(karts);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error al obtener los karts' },
        { status: 500 }
      );
    }
  }