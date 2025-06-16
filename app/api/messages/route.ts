import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        administration: true,
        user: true
      },
      orderBy: {
        created: 'desc'
      }
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { administration, user, ...rest } = data;
    
    // Set administrationId if administration is provided
    if (administration && administration.id) {
      rest.administrationId = administration.id;
    }
    
    // Set userId - for now using a default user, in production this would come from auth
    rest.userId = 1; // Default to first user
    
    // Set created date
    rest.created = new Date(rest.created || new Date());

    const message = await prisma.message.create({ 
      data: rest,
      include: {
        administration: true,
        user: true
      }
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, administration, user, ...rest } = data;
    
    // Set administrationId if administration is provided
    if (administration && administration.id) {
      rest.administrationId = administration.id;
    }
    
    const message = await prisma.message.update({
      where: { id },
      data: rest,
      include: {
        administration: true,
        user: true
      }
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    await prisma.message.delete({ where: { id: data.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}