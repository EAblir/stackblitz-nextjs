import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        administrations: true,
        workflows: true,
        _count: {
          select: {
            administrations: true,
            workflows: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const company = await prisma.company.create({ 
      data,
      include: {
        administrations: true,
        workflows: true,
        _count: {
          select: {
            administrations: true,
            workflows: true
          }
        }
      }
    });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const company = await prisma.company.update({ 
      where: { id }, 
      data: rest,
      include: {
        administrations: true,
        workflows: true,
        _count: {
          select: {
            administrations: true,
            workflows: true
          }
        }
      }
    });
    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    await prisma.company.delete({ where: { id: data.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}