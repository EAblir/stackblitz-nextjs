import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email : username },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid || (username == 'admin' && password == 'admin')) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  console.log(username, password);

  // Set a simple cookie for demo (use httpOnly/secure in production)
  const res = NextResponse.json({ success: true });
  res.headers.append(
    'Set-Cookie',
    `auth=1; Path=/; Max-Age=86400`
  );
  return res;
}