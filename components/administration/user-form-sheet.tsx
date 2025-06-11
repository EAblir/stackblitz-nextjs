'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface User {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin?: string;
  created?: string;
  password?: string;
}

interface UserFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (user: User) => void;
}

export function UserFormSheet({ isOpen, onClose, user, onSave }: UserFormSheetProps) {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '' // Don't pre-fill password for security
      });
      setConfirmPassword('');
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        password: ''
      });
      setConfirmPassword('');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Only validate password for new users or when password is being changed
    if (!isEditing || formData.password) {
      if (!formData.password) {
        toast.error('Password is required');
        return;
      }

      if (formData.password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    const userData = {
      ...formData,
      id: user?.id || Date.now(),
      lastLogin: user?.lastLogin || 'Never',
      created: user?.created || new Date().toISOString().split('T')[0]
    };

    // Remove password from the data if it's empty (for edits)
    if (!userData.password) {
      delete userData.password;
    }

    onSave(userData);
    toast.success(isEditing ? 'User updated successfully' : 'User created successfully');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit User' : 'Create New User'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="password">
              Password {!isEditing ? '*' : '(leave blank to keep current)'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder={isEditing ? "Enter new password" : "Enter password"}
            />
          </div>

          {(!isEditing || formData.password) && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}