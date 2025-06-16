import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const instructions = await prisma.instruction.findMany({
    omit: {
      administrationId: true, // Exclude administrationId from the response
    },
    include: {
      administration: true
    }
  });
  return NextResponse.json(instructions);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Remove nested administration and id from the payload
  const { administration, id, ...rest } = data;
  // If administration is present, set administrationId
  rest.createdAt = new Date(rest.createdAt);

  
  if (administration && administration.id) {
    rest.administrationId = administration.id;
  }

  console.log('Creating instruction with data:', rest);

  const instruction = await prisma.instruction.create({ data: rest });
  return NextResponse.json(instruction, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, administration, ...rest } = data; // remove nested administration
  const instruction = await prisma.instruction.update({
    where: { id },
    data: rest, // rest should only contain scalar fields and administrationId
  });
  return NextResponse.json(instruction);
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  await prisma.instruction.delete({ where: { id: data.id } });
  return NextResponse.json({}, { status: 204 });
}