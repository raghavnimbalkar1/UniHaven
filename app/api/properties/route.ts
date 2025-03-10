import { NextResponse } from 'next/server';
import prisma from '../../utils/db';  // Corrected path to db
import jwt from 'jsonwebtoken';

// 🔄 Function to Verify JWT Token and Return User ID
const verifyToken = (token: string): number | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
  } catch (error) {
    console.error('Invalid Token:', error);
    return null;
  }
};

// 🛠️ POST Request to Create a New Property
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, price } = await req.json();

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price,
        hostId: userId,
      },
    });

    return NextResponse.json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    console.error('Property Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 🛠️ GET Request to Fetch All Properties
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
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
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error Fetching Properties:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}