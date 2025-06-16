import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        company: true,
        user: true,
        steps: {
          orderBy: {
            stepOrder: 'asc'
          }
        },
        _count: {
          select: {
            steps: true
          }
        }
      },
      orderBy: {
        created: 'desc'
      }
    });
    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { steps, ...workflowData } = data;
    
    // Set default userId if not provided (in production this would come from auth)
    if (!workflowData.userId) {
      workflowData.userId = 1;
    }

    const workflow = await prisma.workflow.create({ 
      data: workflowData,
      include: {
        company: true,
        user: true,
        steps: {
          orderBy: {
            stepOrder: 'asc'
          }
        },
        _count: {
          select: {
            steps: true
          }
        }
      }
    });

    // Create workflow steps if provided
    if (steps && steps.length > 0) {
      await prisma.workflowStep.createMany({
        data: steps.map((step: any, index: number) => ({
          ...step,
          workflowId: workflow.id,
          stepOrder: step.stepOrder || index + 1
        }))
      });
    }

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, steps, ...rest } = data;
    
    const workflow = await prisma.workflow.update({ 
      where: { id }, 
      data: rest,
      include: {
        company: true,
        user: true,
        steps: {
          orderBy: {
            stepOrder: 'asc'
          }
        },
        _count: {
          select: {
            steps: true
          }
        }
      }
    });
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    await prisma.workflow.delete({ where: { id: data.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}