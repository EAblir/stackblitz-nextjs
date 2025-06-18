'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Company {
  id: number;
  name: string;
}

export interface Administration {
  id: number;
  accountingOffice: string;
  administrationName: string;
  schedule: string;
  days: string[];
  status: 'open' | 'ongoing' | 'done';
  lastModified: string;
  companyId?: number;
  company?: Company;
}

interface AdministrationsTableProps {
  searchQuery: string;
  administrations: Administration[];
  onEdit: (administration: Administration) => void;
  onDelete: (id: number) => void;
}

export function AdministrationsTable({ searchQuery, administrations, onEdit, onDelete }: AdministrationsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [administrationToDelete, setAdministrationToDelete] = useState<number | null>(null);

  const filteredAdministrations = administrations.filter(admin => 
    admin.accountingOffice.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.administrationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (admin.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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

  const formatDays = (days: string[]) => {
    if (days.length <= 3) {
      return days.join(', ');
    }
    return `${days.slice(0, 3).join(', ')} +${days.length - 3} more`;
  };

  const handleDeleteClick = (id: number) => {
    setAdministrationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (administrationToDelete) {
      onDelete(administrationToDelete);
      setDeleteDialogOpen(false);
      setAdministrationToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">Company</th>
              <th className="text-left p-4 font-medium text-gray-700">Accounting Office</th>
              <th className="text-left p-4 font-medium text-gray-700">Administration Name</th>
              <th className="text-left p-4 font-medium text-gray-700">Schedule</th>
              <th className="text-left p-4 font-medium text-gray-700">Days</th>
              <th className="text-left p-4 font-medium text-gray-700">Status</th>
              <th className="text-left p-4 font-medium text-gray-700">Last Modified</th>
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdministrations.map((admin) => (
              <tr key={admin.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-medium">{admin.company?.name || 'No Company'}</td>
                <td className="p-4 font-medium">{admin.accountingOffice}</td>
                <td className="p-4">{admin.administrationName}</td>
                <td className="p-4 capitalize">{admin.schedule}</td>
                <td className="p-4" title={admin.days.join(', ')}>
                  {formatDays(admin.days)}
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(admin.status)}>
                    {admin.status === 'open' ? 'Open' : admin.status === 'ongoing' ? 'Ongoing' : 'Done'}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-600">{admin.lastModified}</td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(admin)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(admin.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the administration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}