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

export interface Instruction {
  id: number;
  administrationName: string;
  instruction: string;
  status: 'ongoing' | 'closed';
  created: string;
}

interface InstructionsTableProps {
  searchQuery: string;
  instructions: Instruction[];
  onEdit: (instruction: Instruction) => void;
  onDelete: (id: number) => void;
}

export function InstructionsTable({ searchQuery, instructions, onEdit, onDelete }: InstructionsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructionToDelete, setInstructionToDelete] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setInstructionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (instructionToDelete) {
      onDelete(instructionToDelete);
      setDeleteDialogOpen(false);
      setInstructionToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">Administration Name</th>
              <th className="text-left p-4 font-medium text-gray-700">Instruction</th>
              <th className="text-left p-4 font-medium text-gray-700">Status</th>
              <th className="text-left p-4 font-medium text-gray-700">Created</th>
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
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
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(instruction)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(instruction.id)}
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
        
        {filteredInstructions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No instructions found matching your criteria.
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the instruction.
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