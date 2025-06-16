import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { type, format, filters } = await req.json();
    
    let data: any[] = [];
    let filename = '';
    let headers: string[] = [];

    switch (type) {
      case 'administrations':
        data = await prisma.administration.findMany({
          include: {
            company: true
          }
        });
        filename = `administrations_${new Date().toISOString().split('T')[0]}`;
        headers = ['ID', 'Accounting Office', 'Administration Name', 'Company', 'Schedule', 'Days', 'Status', 'Created', 'Last Modified'];
        break;

      case 'instructions':
        data = await prisma.instruction.findMany({
          include: {
            administration: true
          }
        });
        filename = `instructions_${new Date().toISOString().split('T')[0]}`;
        headers = ['ID', 'Content', 'Administration', 'Status', 'Created'];
        break;

      case 'messages':
        data = await prisma.message.findMany({
          include: {
            administration: true,
            user: true
          }
        });
        filename = `messages_${new Date().toISOString().split('T')[0]}`;
        headers = ['ID', 'Type', 'Status', 'Administration', 'Invoice Number', 'Fields', 'Message', 'Assignee', 'User', 'Created'];
        break;

      case 'workflows':
        data = await prisma.workflow.findMany({
          include: {
            company: true,
            user: true,
            _count: {
              select: {
                steps: true
              }
            }
          }
        });
        filename = `workflows_${new Date().toISOString().split('T')[0]}`;
        headers = ['ID', 'Name', 'Description', 'Company', 'Trigger', 'Schedule', 'Status', 'Last Run', 'Executions', 'Steps', 'Created By', 'Created'];
        break;

      case 'companies':
        data = await prisma.company.findMany({
          include: {
            _count: {
              select: {
                administrations: true,
                workflows: true
              }
            }
          }
        });
        filename = `companies_${new Date().toISOString().split('T')[0]}`;
        headers = ['ID', 'Name', 'Industry', 'Size', 'Country', 'Website', 'Description', 'Status', 'Administrations', 'Workflows', 'Created'];
        break;

      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    if (format === 'excel') {
      // For Excel format, return structured data that can be processed by a client-side library
      const excelData = data.map(item => {
        switch (type) {
          case 'administrations':
            return {
              'ID': item.id,
              'Accounting Office': item.accountingOffice,
              'Administration Name': item.administrationName,
              'Company': item.company?.name || 'N/A',
              'Schedule': item.schedule,
              'Days': Array.isArray(item.days) ? item.days.join(', ') : item.days,
              'Status': item.status,
              'Created': new Date(item.created).toLocaleDateString(),
              'Last Modified': new Date(item.lastModified).toLocaleDateString()
            };
          case 'instructions':
            return {
              'ID': item.id,
              'Content': item.content,
              'Administration': item.administration?.administrationName || 'General',
              'Status': item.status,
              'Created': new Date(item.createdAt).toLocaleDateString()
            };
          case 'messages':
            return {
              'ID': item.id,
              'Type': item.type,
              'Status': item.status,
              'Administration': item.administration?.administrationName || 'N/A',
              'Invoice Number': item.invoiceNumber || 'N/A',
              'Fields': item.fields || 'N/A',
              'Message': item.message,
              'Assignee': item.assignee || 'Unassigned',
              'User': item.user?.name || 'N/A',
              'Created': new Date(item.created).toLocaleDateString()
            };
          case 'workflows':
            return {
              'ID': item.id,
              'Name': item.name,
              'Description': item.description,
              'Company': item.company?.name || 'N/A',
              'Trigger': item.trigger,
              'Schedule': item.schedule || 'N/A',
              'Status': item.status,
              'Last Run': item.lastRun ? new Date(item.lastRun).toLocaleDateString() : 'Never',
              'Executions': item.executions,
              'Steps': item._count?.steps || 0,
              'Created By': item.user?.name || 'N/A',
              'Created': new Date(item.created).toLocaleDateString()
            };
          case 'companies':
            return {
              'ID': item.id,
              'Name': item.name,
              'Industry': item.industry,
              'Size': item.size,
              'Country': item.country,
              'Website': item.website || 'N/A',
              'Description': item.description || 'N/A',
              'Status': item.status,
              'Administrations': item._count?.administrations || 0,
              'Workflows': item._count?.workflows || 0,
              'Created': new Date(item.created).toLocaleDateString()
            };
          default:
            return item;
        }
      });

      return NextResponse.json({
        data: excelData,
        filename: `${filename}.xlsx`,
        headers
      });
    } else if (format === 'pdf') {
      // For PDF format, return structured data for client-side PDF generation
      return NextResponse.json({
        data,
        filename: `${filename}.pdf`,
        headers,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
        generatedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}