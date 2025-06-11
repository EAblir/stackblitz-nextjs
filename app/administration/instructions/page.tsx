'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InstructionsTable, Instruction } from '@/components/administration/instructions-table';
import { InstructionFormSheet } from '@/components/administration/instruction-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

const initialInstructions: Instruction[] = [
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

export default function InstructionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>(initialInstructions);

  const handleSaveInstruction = (instructionData: Instruction) => {
    if (editingInstruction) {
      // Update existing instruction
      setInstructions(prev => prev.map(inst => 
        inst.id === instructionData.id ? instructionData : inst
      ));
    } else {
      // Add new instruction
      setInstructions(prev => [...prev, instructionData]);
    }
    setShowFormSheet(false);
    setEditingInstruction(null);
  };

  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setShowFormSheet(true);
  };

  const handleDeleteInstruction = (id: number) => {
    setInstructions(prev => prev.filter(inst => inst.id !== id));
    toast.success('Instruction deleted successfully');
  };

  const handleCreateNew = () => {
    setEditingInstruction(null);
    setShowFormSheet(true);
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Instructions</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Instruction
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search instructions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <InstructionsTable 
            searchQuery={searchQuery}
            instructions={instructions}
            onEdit={handleEditInstruction}
            onDelete={handleDeleteInstruction}
          />
        </div>

        <InstructionFormSheet 
          isOpen={showFormSheet}
          onClose={() => {
            setShowFormSheet(false);
            setEditingInstruction(null);
          }}
          instruction={editingInstruction}
          onSave={handleSaveInstruction}
        />
      </div>
    </DashboardLayout>
  );
}