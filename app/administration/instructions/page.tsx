'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InstructionsTable, Instruction } from '@/components/administration/instructions-table';
import { InstructionFormSheet } from '@/components/administration/instruction-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { downloadExcel, downloadPDF } from '@/lib/export-utils';

export default function InstructionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [exporting, setExporting] = useState(false);
 
  useEffect(() => {
    fetch('/api/instructions')
      .then(res => res.json())
      .then(setInstructions)
      .catch(() => toast.error('Failed to load instructions'));
  }, []);

  const handleSaveInstruction = async (instructionData: Instruction) => {
    if (editingInstruction) {
      // Update existing instruction
      const updatedData = instructionData.content;
      console.log(updatedData);
      const res = await fetch('/api/instructions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instructionData),
      });

      if (res.ok) {
        setInstructions(prev => prev.map(inst => 
          inst.id === instructionData.id ? instructionData : inst
        ));

      } else {
        toast.error('Failed to update instruction');
      }
      
    } else {
      const res = await fetch('/api/instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instructionData),
      });
      
      if (res.ok) {
        const newInstruction = await res.json();
        setInstructions(prev => [...prev, newInstruction]);
      } else {
        toast.error('Failed to create instruction');
      }
      // Add new instruction
    }

    setShowFormSheet(false);
    setEditingInstruction(null);
  };

  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setShowFormSheet(true);
  };

  const handleDeleteInstruction = async (id: number) => {
    const res = await fetch('/api/instructions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setInstructions(prev => prev.filter(inst => inst.id !== id));
      toast.success('Instruction deleted successfully');
    } else {
      toast.error('Failed to delete instruction');
    }  
  };

  const handleCreateNew = () => {
    setEditingInstruction(null);
    setShowFormSheet(true);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setExporting(true);
      if (format === 'excel') {
        await downloadExcel('instructions');
        toast.success('Excel file downloaded successfully');
      } else {
        await downloadPDF('instructions');
        toast.success('PDF export opened in new window');
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
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
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleExport('excel')}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Excel'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
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