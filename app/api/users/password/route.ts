import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // TODO: Get user ID from session/auth (replace with your logic)
  const userId = /* get user id from session/cookie */;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { password } = await req.json();
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password too short' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}