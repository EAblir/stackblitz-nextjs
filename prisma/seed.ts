import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Companies
  await prisma.message.deleteMany({});
  await prisma.instruction.deleteMany({});
  await prisma.administration.deleteMany({});
  await prisma.workflow.deleteMany({});
  await prisma.workflowStep.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany?.({});

  const companies = await prisma.company.createMany({
    data: [
      {
        name: 'Acme Corporation',
        industry: 'Technology',
        size: 'large',
        country: 'United States',
        website: 'https://acme.com',
        description: 'Leading technology solutions provider',
        logo: '🏢',
        status: 'active'
      },
      {
        name: 'TechStart Inc',
        industry: 'Software',
        size: 'medium',
        country: 'Canada',
        website: 'https://techstart.ca',
        description: 'Innovative software development company',
        logo: '💻',
        status: 'active'
      },
      {
        name: 'Global Solutions Ltd',
        industry: 'Consulting',
        size: 'enterprise',
        country: 'United Kingdom',
        website: 'https://globalsolutions.co.uk',
        description: 'International business consulting firm',
        logo: '🌍',
        status: 'active'
      },
      {
        name: 'Innovation Co',
        industry: 'Research',
        size: 'small',
        country: 'Germany',
        website: 'https://innovation.de',
        description: 'Research and development company',
        logo: '🔬',
        status: 'active'
      },
      {
        name: 'Digital Dynamics',
        industry: 'Marketing',
        size: 'medium',
        country: 'Australia',
        website: 'https://digitaldynamics.com.au',
        description: 'Digital marketing and advertising agency',
        logo: '📱',
        status: 'active'
      }
    ]
  });

  // Users 
  const users = await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        status: 'active',
        created: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-15'),
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'user',
        status: 'active',
        created: new Date('2024-01-11'),
        lastLogin: new Date('2024-01-14'),
      },
      {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        role: 'user',
        status: 'inactive',
        created: new Date('2024-01-12'),
        lastLogin: new Date('2024-01-13'),
      },
      {
        id: 4,
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        role: 'user',
        status: 'active',
        created: new Date('2024-01-13'),
        lastLogin: new Date('2024-01-16'),
      },
      {
        id: 5,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@example.com',
        role: 'admin',
        status: 'active',
        created: new Date('2024-01-14'),
        lastLogin: new Date('2024-01-17'),
      }
    ],
  });

  // Get company IDs for relations
  const companyList = await prisma.company.findMany();
  const acmeCorp = companyList.find(c => c.name === 'Acme Corporation');
  const techStart = companyList.find(c => c.name === 'TechStart Inc');
  const globalSolutions = companyList.find(c => c.name === 'Global Solutions Ltd');
  const innovationCo = companyList.find(c => c.name === 'Innovation Co');
  const digitalDynamics = companyList.find(c => c.name === 'Digital Dynamics');

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
      companyId: acmeCorp?.id
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
      companyId: techStart?.id
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
      companyId: globalSolutions?.id
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
      {
        content: 'General instruction: All expense reports must include receipts.',
        administrationId: null,
        createdAt: new Date('2024-01-13'),
      },
      {
        content: 'VAT calculations should be reviewed monthly.',
        administrationId: admin1.id,
        createdAt: new Date('2024-01-14'),
      }
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
        assigneeId: 2,
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
        assigneeId: 1,
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
        assigneeId: 3,
        created: new Date('2024-01-13'),
        userId: 3,
      },
      {
        type: 'question',
        status: 'open',
        administrationId: null,
        invoiceNumber: 'INV-2024-004',
        fields: 'Payment terms',
        message: 'What are the standard payment terms for new clients?',
        assigneeId: 1,
        created: new Date('2024-01-16'),
        userId: 4,
      }
    ],
  });

  // Workflows
  const workflow1 = await prisma.workflow.create({
    data: {
      name: 'Invoice Auto-Processing',
      description: 'Automatically process incoming invoices and extract data',
      trigger: 'email',
      status: 'active',
      lastRun: new Date('2024-01-15T14:30:00Z'),
      executions: 342,
      created: new Date('2024-01-01'),
      companyId: acmeCorp?.id,
      userId: 1
    }
  });

  const workflow2 = await prisma.workflow.create({
    data: {
      name: 'Bank Reconciliation',
      description: 'Match bank transactions with accounting entries',
      trigger: 'schedule',
      schedule: 'daily',
      status: 'active',
      lastRun: new Date('2024-01-15T09:00:00Z'),
      executions: 28,
      created: new Date('2024-01-05'),
      companyId: techStart?.id,
      userId: 2
    }
  });

  const workflow3 = await prisma.workflow.create({
    data: {
      name: 'Expense Report Approval',
      description: 'Route expense reports for manager approval',
      trigger: 'form',
      status: 'paused',
      lastRun: new Date('2024-01-10T16:45:00Z'),
      executions: 156,
      created: new Date('2024-01-03'),
      companyId: globalSolutions?.id,
      userId: 3
    }
  });

  const workflow4 = await prisma.workflow.create({
    data: {
      name: 'VAT Calculation',
      description: 'Calculate VAT for EU transactions',
      trigger: 'manual',
      status: 'draft',
      lastRun: null,
      executions: 0,
      created: new Date('2024-01-14'),
      companyId: innovationCo?.id,
      userId: 1
    }
  });

  const workflow5 = await prisma.workflow.create({
    data: {
      name: 'Monthly Financial Report',
      description: 'Generate comprehensive monthly financial reports',
      trigger: 'schedule',
      schedule: 'monthly',
      status: 'active',
      lastRun: new Date('2024-01-01T08:00:00Z'),
      executions: 12,
      created: new Date('2023-12-01'),
      companyId: digitalDynamics?.id,
      userId: 4
    }
  });

  // Workflow Steps
  await prisma.workflowStep.createMany({
    data: [
      // Invoice Auto-Processing steps
      {
        workflowId: workflow1.id,
        stepOrder: 1,
        stepType: 'action',
        name: 'Extract Email Attachments',
        description: 'Extract PDF attachments from incoming emails',
        config: { emailFilter: 'invoices@*', fileTypes: ['pdf'] }
      },
      {
        workflowId: workflow1.id,
        stepOrder: 2,
        stepType: 'action',
        name: 'OCR Processing',
        description: 'Extract text and data from invoice PDFs',
        config: { ocrEngine: 'tesseract', confidence: 0.8 }
      },
      {
        workflowId: workflow1.id,
        stepOrder: 3,
        stepType: 'condition',
        name: 'Validate Invoice Data',
        description: 'Check if required fields are present',
        config: { requiredFields: ['amount', 'vendor', 'date'] }
      },
      {
        workflowId: workflow1.id,
        stepOrder: 4,
        stepType: 'integration',
        name: 'Create Accounting Entry',
        description: 'Create entry in accounting system',
        config: { system: 'quickbooks', account: 'accounts_payable' }
      },
      // Bank Reconciliation steps
      {
        workflowId: workflow2.id,
        stepOrder: 1,
        stepType: 'integration',
        name: 'Fetch Bank Transactions',
        description: 'Download latest bank transactions',
        config: { bankApi: 'plaid', account: 'checking' }
      },
      {
        workflowId: workflow2.id,
        stepOrder: 2,
        stepType: 'action',
        name: 'Match Transactions',
        description: 'Match bank transactions with accounting entries',
        config: { matchingRules: ['amount', 'date', 'description'] }
      },
      {
        workflowId: workflow2.id,
        stepOrder: 3,
        stepType: 'action',
        name: 'Generate Reconciliation Report',
        description: 'Create reconciliation report',
        config: { format: 'pdf', recipients: ['finance@company.com'] }
      }
    ]
  });

  console.log('Seed data created successfully!');
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