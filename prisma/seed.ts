import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Users 
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        status: 'active',
        created: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-15'),
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'user',
        status: 'active',
        created: new Date('2024-01-11'),
        lastLogin: new Date('2024-01-14'),
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        role: 'user',
        status: 'inactive',
        created: new Date('2024-01-12'),
        lastLogin: new Date('2024-01-13'),
      },
    ],
  });

  // Administrations
  const admin1 = await prisma.administration.create({
    data: {
      accountingOffice: 'Premier Accounting',
      administrationName: 'Acme Corp',
      schedule: 'monthly',
      days: ['1'],
      status: 'open',
      created: new Date('2024-01-10'),
      lastModified: new Date('2024-01-15'),
    },
  });
  const admin2 = await prisma.administration.create({
    data: {
      accountingOffice: 'Financial Partners',
      administrationName: 'TechStart Inc',
      schedule: 'weekly',
      days: ['Friday'],
      status: 'ongoing',
      created: new Date('2024-01-11'),
      lastModified: new Date('2024-01-14'),
    },
  });
  const admin3 = await prisma.administration.create({
    data: {
      accountingOffice: 'Accounting Plus',
      administrationName: 'Global Solutions',
      schedule: 'daily',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      status: 'done',
      created: new Date('2024-01-12'),
      lastModified: new Date('2024-01-13'),
    },
  });

  // Instructions
  await prisma.instruction.createMany({
    data: [
      {
        content: 'Please submit all invoices by the 1st of each month.',
        administrationId: admin1.id,
        createdAt: new Date('2024-01-10'),
      },
      {
        content: 'Weekly reports are due every Friday.',
        administrationId: admin2.id,
        createdAt: new Date('2024-01-11'),
      },
      {
        content: 'Daily standup at 9am.',
        administrationId: admin3.id,
        createdAt: new Date('2024-01-12'),
      },
    ],
  });

  // Messages
  await prisma.message.createMany({
    data: [
      {
        type: 'question',
        status: 'open',
        administrationId: admin1.id,
        invoiceNumber: 'INV-2024-001',
        fields: 'Invoice number, G/L code',
        message: 'Need clarification on the VAT calculation for this invoice.',
        assignee: 'John Doe',
        created: new Date('2024-01-15'),
        userId: 1,
      },
      {
        type: 'feedback',
        status: 'resolved',
        administrationId: admin2.id,
        invoiceNumber: 'INV-2024-002',
        fields: 'VAT code',
        message: 'The VAT rate seems incorrect for EU transactions.',
        assignee: 'Sarah Johnson',
        created: new Date('2024-01-14'),
        userId: 2,
      },
      {
        type: 'question',
        status: 'answered',
        administrationId: admin3.id,
        invoiceNumber: 'INV-2024-003',
        fields: 'G/L code',
        message: 'Which account should be used for office supplies?',
        assignee: 'Mike Chen',
        created: new Date('2024-01-13'),
        userId: 3,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });