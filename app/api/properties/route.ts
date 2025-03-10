import { NextResponse } from 'next/server';
import prisma from '../../utils/db';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { title, description, price } = await req.json();

    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price,
        hostId: (decoded as any).id,
      },
    });

    return NextResponse.json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    console.error('Property Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error Fetching Properties:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}