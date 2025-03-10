import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import jwt from 'jsonwebtoken';

// 🛠️ POST: Create a Booking
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decoded.id;

    const { propertyId, date } = await req.json();

    if (!propertyId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        date: new Date(date),
        propertyId,
        userId,
      },
    });

    return NextResponse.json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 🛠️ GET: Fetch User's Bookings
export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decoded.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            title: true,
            description: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error Fetching Bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}