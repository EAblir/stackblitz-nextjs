'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Administration {
  id: number;
  administrationName: string;
}

interface User {
  id: number;
  name: string;
}

interface Message {
  id?: number;
  type: 'question' | 'feedback';
  status: 'open' | 'answered' | 'resolved';
  administration?: Administration;
  administrationId?: number;
  invoiceNumber?: string;
  fields?: string;
  message: string;
  assignee?: User;
  assigneeId?: number;
  created?: string;
  user?: User;
  userId?: number;
}

interface MessageFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  message?: Message | null;
  onSave: (message: Message) => void;
}

export function MessageFormSheet({ isOpen, onClose, message, onSave }: MessageFormSheetProps) {
  const [administrations, setAdministrations] = useState<Administration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Message>({
    type: 'question',
    status: 'open',
    message: '',
    invoiceNumber: '',
    fields: '',
    assigneeId: undefined
  });

  const isEditing = !!message;

  // Fetch administrations and users
  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/administrations').then(res => res.json()),
        fetch('/api/users').then(res => res.json())
      ]).then(([adminData, userData]) => {
        setAdministrations(adminData);
        setUsers(userData);
      }).catch(() => {
        toast.error('Failed to load form data');
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (message) {
      setFormData({
        ...message,
        administrationId: message.administration?.id
      });
    } else {
      setFormData({
        type: 'question',
        status: 'open',
        message: '',
        invoiceNumber: '',
        fields: '',
        assigneeId: undefined
      });
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const messageData = {
      ...formData,
      id: message?.id || undefined,
      created: message?.created || new Date().toISOString(),
      administration: formData.administrationId 
        ? administrations.find(admin => admin.id === formData.administrationId)
        : undefined
    };

    onSave(messageData);
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
            <Label htmlFor="administrationId">Administration</Label>
            <Select 
              value={formData.administrationId ? String(formData.administrationId) : ''} 
              onValueChange={(value) => setFormData({...formData, administrationId: value ? parseInt(value) : undefined})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select administration (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(undefined)}>No administration</SelectItem>
                {administrations.map((admin) => (
                  <SelectItem key={admin.id} value={String(admin.id)}>
                    {admin.administrationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber || ''}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="INV-2024-001"
              />
            </div>
            
            <div>
              <Label htmlFor="fields">Fields</Label>
              <Input
                id="fields"
                value={formData.fields || ''}
                onChange={(e) => setFormData({...formData, fields: e.target.value})}
                placeholder="Invoice number, G/L code, VAT"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={formData.assigneeId ? String(formData.assigneeId) : ''} 
              onValueChange={(value) => setFormData({...formData, assigneeId: value ? parseInt(value) : undefined})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(undefined)}>No assignee</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
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