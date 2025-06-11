'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkflowModal({ isOpen, onClose }: CreateWorkflowModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    schedule: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.trigger) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating workflow:', formData);
    toast.success('Workflow created successfully');
    onClose();
    
    setFormData({
      name: '',
      description: '',
      trigger: '',
      schedule: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workflow Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter workflow name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this workflow does..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="trigger">Trigger *</Label>
            <Select value={formData.trigger} onValueChange={(value) => setFormData({...formData, trigger: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Receipt</SelectItem>
                <SelectItem value="schedule">Daily Schedule</SelectItem>
                <SelectItem value="form">Form Submission</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.trigger === 'schedule' && (
            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Select value={formData.schedule} onValueChange={(value) => setFormData({...formData, schedule: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Workflow
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}