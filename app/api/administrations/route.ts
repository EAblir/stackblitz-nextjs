import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const administrations = await prisma.administration.findMany({include: {
      company: true
    }
  });
  return NextResponse.json(administrations);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const administrations = await prisma.administration.create({ data });
  return NextResponse.json(administrations, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...rest } = data;
  const administrations = await prisma.administration.update({ where: { id }, data: rest });
  return NextResponse.json(administrations);
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  await prisma.administration.delete({ where: { id: data.id } });
  return NextResponse.json({}, { status: 204 });
}