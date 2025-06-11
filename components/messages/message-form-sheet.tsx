'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Message {
  id?: number;
  type: 'question' | 'feedback';
  status: 'open' | 'answered' | 'resolved';
  administrationName: string;
  invoiceNumber: string;
  fields: string;
  message: string;
  assignee: string;
  created?: string;
}

interface MessageFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  message?: Message | null;
  onSave: (message: Message) => void;
}

export function MessageFormSheet({ isOpen, onClose, message, onSave }: MessageFormSheetProps) {
  const [formData, setFormData] = useState<Message>({
    type: 'question',
    status: 'open',
    administrationName: '',
    invoiceNumber: '',
    fields: '',
    message: '',
    assignee: ''
  });

  const isEditing = !!message;

  useEffect(() => {
    if (message) {
      setFormData(message);
    } else {
      setFormData({
        type: 'question',
        status: 'open',
        administrationName: '',
        invoiceNumber: '',
        fields: '',
        message: '',
        assignee: ''
      });
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.administrationName || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const messageData = {
      ...formData,
      id: message?.id || Date.now(),
      created: message?.created || new Date().toISOString().split('T')[0]
    };

    onSave(messageData);
    toast.success(isEditing ? 'Message updated successfully' : 'Message created successfully');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Message' : 'Create New Message'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: 'question' | 'feedback') => setFormData({...formData, type: value})}>
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
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'open' | 'answered' | 'resolved') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {isEditing ? 'Update Message' : 'Create Message'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}