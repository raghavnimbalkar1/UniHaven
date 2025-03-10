import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../utils/db';

export async function POST(req: Request) {
  try {
    console.log('Connecting to database...');
    
    const { email, password } = await req.json();
    console.log('Received login request for:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match status:', isMatch);

    if (!isMatch) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('JWT Token created:', token);

    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('token', token, { httpOnly: true, path: '/' });

    console.log('Login successful for:', email);
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}