'use client';

import { Badge } from '@/components/ui/badge';

interface Administration {
  id: number;
  accountingOffice: string;
  administrationName: string;
  schedule: string;
  days: string;
  status: 'open' | 'ongoing' | 'done';
  lastModified: string;
}

const administrations: Administration[] = [
  {
    id: 1,
    accountingOffice: 'Premier Accounting',
    administrationName: 'Acme Corp',
    schedule: 'Monthly',
    days: '1st of each month',
    status: 'open',
    lastModified: '2024-01-15'
  },
  {
    id: 2,
    accountingOffice: 'Financial Partners',
    administrationName: 'TechStart Inc',
    schedule: 'Weekly',
    days: 'Every Friday',
    status: 'ongoing',
    lastModified: '2024-01-14'
  },
  {
    id: 3,
    accountingOffice: 'Accounting Plus',
    administrationName: 'Global Solutions',
    schedule: 'Daily',
    days: 'Every weekday',
    status: 'done',
    lastModified: '2024-01-13'
  }
];

interface AdministrationsTableProps {
  searchQuery: string;
}

export function AdministrationsTable({ searchQuery }: AdministrationsTableProps) {
  const filteredAdministrations = administrations.filter(admin => 
    admin.accountingOffice.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.administrationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-700">Accounting Office</th>
            <th className="text-left p-4 font-medium text-gray-700">Administration Name</th>
            <th className="text-left p-4 font-medium text-gray-700">Schedule</th>
            <th className="text-left p-4 font-medium text-gray-700">Days</th>
            <th className="text-left p-4 font-medium text-gray-700">Status</th>
            <th className="text-left p-4 font-medium text-gray-700">Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdministrations.map((admin) => (
            <tr key={admin.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-4 font-medium">{admin.accountingOffice}</td>
              <td className="p-4">{admin.administrationName}</td>
              <td className="p-4">{admin.schedule}</td>
              <td className="p-4">{admin.days}</td>
              <td className="p-4">
                <Badge className={getStatusColor(admin.status)}>
                  {admin.status === 'open' ? 'Open' : admin.status === 'ongoing' ? 'Ongoing' : 'Done'}
                </Badge>
              </td>
              <td className="p-4 text-sm text-gray-600">{admin.lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredAdministrations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No administrations found matching your criteria.
        </div>
      )}
    </div>
  );
}