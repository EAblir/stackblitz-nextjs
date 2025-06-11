'use client';

import { Badge } from '@/components/ui/badge';

interface Instruction {
  id: number;
  administrationName: string;
  instruction: string;
  status: 'ongoing' | 'closed';
  created: string;
}

const instructions: Instruction[] = [
  {
    id: 1,
    administrationName: 'Acme Corp',
    instruction: 'All invoices must be processed within 24 hours of receipt.',
    status: 'ongoing',
    created: '2024-01-15'
  },
  {
    id: 2,
    administrationName: 'TechStart Inc',
    instruction: 'Require manager approval for expenses over €500.',
    status: 'closed',
    created: '2024-01-14'
  },
  {
    id: 3,
    administrationName: 'Global Solutions',
    instruction: 'Monthly bank reconciliation due by 5th of each month.',
    status: 'ongoing',
    created: '2024-01-13'
  }
];

interface InstructionsTableProps {
  searchQuery: string;
}

export function InstructionsTable({ searchQuery }: InstructionsTableProps) {
  const filteredInstructions = instructions.filter(instruction => 
    instruction.administrationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instruction.instruction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-700">Administration Name</th>
            <th className="text-left p-4 font-medium text-gray-700">Instruction</th>
            <th className="text-left p-4 font-medium text-gray-700">Status</th>
            <th className="text-left p-4 font-medium text-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstructions.map((instruction) => (
            <tr key={instruction.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-4 font-medium">{instruction.administrationName}</td>
              <td className="p-4 max-w-md">{instruction.instruction}</td>
              <td className="p-4">
                <Badge className={getStatusColor(instruction.status)}>
                  {instruction.status === 'ongoing' ? 'Ongoing' : 'Closed'}
                </Badge>
              </td>
              <td className="p-4 text-sm text-gray-600">{instruction.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredInstructions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No instructions found matching your criteria.
        </div>
      )}
    </div>
  );
}