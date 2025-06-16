'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMessageModal({ isOpen, onClose }: CreateMessageModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    administrationName: '',
    invoiceNumber: '',
    fields: '',
    message: '',
    assignee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.type || !formData.administrationName || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your API
    console.log('Creating message:', formData);
    
    toast.success('Message created successfully');
    onClose();
    
    // Reset form
    setFormData({
      type: '',
      administrationName: '',
      invoiceNumber: '',
      fields: '',
      message: '',
      assignee: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Message</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="administrationName">Administration Name *</Label>
              <Input
                id="administrationName"
                value={formData.administrationName}
                onChange={(e) => setFormData({...formData, administrationName: e.target.value})}
                placeholder="Enter administration name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="INV-2024-001"
              />
            </div>
            
            <div>
              <Label htmlFor="fields">Fields</Label>
              <Input
                id="fields"
                value={formData.fields}
                onChange={(e) => setFormData({...formData, fields: e.target.value})}
                placeholder="Invoice number, G/L code, VAT"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={formData.assignee} onValueChange={(value) => setFormData({...formData, assignee: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                <SelectItem value="mike-chen">Mike Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}