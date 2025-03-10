import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        property: {
          include: {
            host: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Booking Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}