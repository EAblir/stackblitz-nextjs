'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CreateInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInstructionModal({ isOpen, onClose }: CreateInstructionModalProps) {
  const [formData, setFormData] = useState({
    administrationName: '',
    instruction: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.administrationName || !formData.instruction) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating instruction:', formData);
    toast.success('Instruction created successfully');
    onClose();
    
    setFormData({
      administrationName: '',
      instruction: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Instruction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="administrationName">Administration Name *</Label>
            <Input
              id="administrationName"
              value={formData.administrationName}
              onChange={(e) => setFormData({...formData, administrationName: e.target.value})}
              placeholder="Enter administration name"
            />
          </div>

          <div>
            <Label htmlFor="instruction">Instruction *</Label>
            <Textarea
              id="instruction"
              value={formData.instruction}
              onChange={(e) => setFormData({...formData, instruction: e.target.value})}
              placeholder="Enter the instruction details..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Instruction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}