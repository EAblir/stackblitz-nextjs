import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Administration } from '@prisma/client';

interface Instruction {
  id?: number;
  administration?: Administration;
  content: string;
  status: string | 'ongoing' | 'closed';
  createdAt?: string;
}

interface InstructionFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  instruction?: Instruction | null;
  onSave: (instruction: Instruction) => void;
  selectedCompanyId?: number;
}

export function InstructionFormSheet({ 
  isOpen, 
  onClose, 
  instruction, 
  onSave, 
  selectedCompanyId 
}: InstructionFormSheetProps) {
  const [administrations, setAdministrations] = useState<Administration[]>([]);
  const [formData, setFormData] = useState<Instruction>({
    administration: undefined,
    content: '',
    status: 'ongoing'
  });

  useEffect(() => {
    if (isOpen) {
      fetchAdministrations();
    }
  }, [isOpen, selectedCompanyId]);

  const fetchAdministrations = async () => {
    try {
      const response = await fetch('/api/administrations');
      if (response.ok) {
        const data = await response.json();
        // Filter by selected company if available
        const filtered = selectedCompanyId 
          ? data.filter((admin: Administration) => admin.companyId === selectedCompanyId)
          : data;
        setAdministrations(filtered);
      } else {
        toast.error('Failed to load administrations');
      }
    } catch (error) {
      console.error('Error fetching administrations:', error);
      toast.error('Failed to load administrations');
    }
  };

  const isEditing = !!instruction;

  useEffect(() => {
    if (instruction) {
      setFormData(instruction);
    } else {
      setFormData({
        administration: undefined,
        content: '',
        status: 'ongoing'
      });
    }
  }, [instruction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const instructionData = {
      ...formData,
      id: instruction?.id || Date.now(),
      createdAt: instruction?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(instructionData);
    toast.success(isEditing ? 'Instruction updated successfully' : 'Instruction created successfully');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Instruction' : 'Create New Instruction'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="administrationId">Administration</Label>
            <Select
              value={formData.administration?.id ? String(formData.administration?.id) : ''}
              onValueChange={(value) =>
                setFormData({ 
                  ...formData, 
                  administration: value === '' 
                    ? undefined 
                    : administrations.find((admin) => String(admin.id) === value) 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="*General instruction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(undefined)} textValue={'*General instruction'}>
                  General instruction
                </SelectItem>
                {administrations.map((admin) => (
                  <SelectItem key={admin.id} value={String(admin.id)} textValue={admin.administrationName}>
                    {admin.administrationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCompanyId && administrations.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No administrations found for the selected company.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value: 'ongoing' | 'closed') => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="instruction">Instruction *</Label>
            <Textarea
              id="instruction"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter the instruction details..."
              rows={6}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Instruction' : 'Create Instruction'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}