import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(params.id) },
      include: {
        host: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error Fetching Property:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}