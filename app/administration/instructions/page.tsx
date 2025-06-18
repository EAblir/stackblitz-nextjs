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
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [allInstructions, setAllInstructions] = useState<Instruction[]>([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchInstructions();
  }, []);

  // Filter instructions based on selected company
  useEffect(() => {
    if (selectedCompanyId) {
      const filtered = allInstructions.filter(instruction => 
        instruction.administration?.companyId === selectedCompanyId || 
        !instruction.administration // Include general instructions
      );
      setInstructions(filtered);
    } else {
      setInstructions(allInstructions);
    }
  }, [selectedCompanyId, allInstructions]);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instructions');
      if (response.ok) {
        const data = await response.json();
        setAllInstructions(data);
        setInstructions(data);
      } else {
        toast.error('Failed to load instructions');
      }
    } catch (error) {
      console.error('Error fetching instructions:', error);
      toast.error('Failed to load instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstruction = async (instructionData: Instruction) => {
    try {
      if (editingInstruction) {
        // Update existing instruction
        const response = await fetch('/api/instructions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instructionData),
        });

        if (response.ok) {
          const updatedInstruction = await response.json();
          setAllInstructions(prev => prev.map(inst => 
            inst.id === updatedInstruction.id ? updatedInstruction : inst
          ));
          toast.success('Instruction updated successfully');
        } else {
          toast.error('Failed to update instruction');
          return;
        }
      } else {
        const response = await fetch('/api/instructions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instructionData),
        });
        
        if (response.ok) {
          const newInstruction = await response.json();
          setAllInstructions(prev => [...prev, newInstruction]);
          toast.success('Instruction created successfully');
        } else {
          toast.error('Failed to create instruction');
          return;
        }
      }

      setShowFormSheet(false);
      setEditingInstruction(null);
    } catch (error) {
      console.error('Error saving instruction:', error);
      toast.error('Failed to save instruction');
    }
  };

  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setShowFormSheet(true);
  };

  const handleDeleteInstruction = async (id: number) => {
    try {
      const response = await fetch('/api/instructions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAllInstructions(prev => prev.filter(inst => inst.id !== id));
        toast.success('Instruction deleted successfully');
      } else {
        toast.error('Failed to delete instruction');
      }
    } catch (error) {
      console.error('Error deleting instruction:', error);
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

  if (loading) {
    return (
      <DashboardLayout 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={setSelectedCompanyId}
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading instructions...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructions</h1>
            {selectedCompanyId && (
              <p className="text-gray-600 mt-1">
                Showing instructions for selected company and general instructions
              </p>
            )}
          </div>
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
          selectedCompanyId={selectedCompanyId}
        />
      </div>
    </DashboardLayout>
  );
}