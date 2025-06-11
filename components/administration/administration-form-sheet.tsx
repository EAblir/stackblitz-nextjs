'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Administration {
  id?: number;
  accountingOffice: string;
  administrationName: string;
  schedule: string;
  days: string[];
  status: 'open' | 'ongoing' | 'done';
  lastModified?: string;
}

interface AdministrationFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  administration?: Administration | null;
  onSave: (administration: Administration) => void;
}

export function AdministrationFormSheet({ isOpen, onClose, administration, onSave }: AdministrationFormSheetProps) {
  const [formData, setFormData] = useState<Administration>({
    accountingOffice: '',
    administrationName: '',
    schedule: '',
    days: [],
    status: 'open'
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const isEditing = !!administration;

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthDays = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    if (administration) {
      setFormData(administration);
      setSelectedDays(administration.days || []);
    } else {
      setFormData({
        accountingOffice: '',
        administrationName: '',
        schedule: '',
        days: [],
        status: 'open'
      });
      setSelectedDays([]);
    }
  }, [administration]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accountingOffice || !formData.administrationName || !formData.schedule) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    const administrationData = {
      ...formData,
      days: selectedDays,
      id: administration?.id || Date.now(),
      lastModified: new Date().toISOString().split('T')[0]
    };

    onSave(administrationData);
    toast.success(isEditing ? 'Administration updated successfully' : 'Administration created successfully');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Administration' : 'Create New Administration'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountingOffice">Accounting Office *</Label>
              <Input
                id="accountingOffice"
                value={formData.accountingOffice}
                onChange={(e) => setFormData({...formData, accountingOffice: e.target.value})}
                placeholder="Enter accounting office name"
              />
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
              <Label htmlFor="schedule">Schedule *</Label>
              <Select value={formData.schedule} onValueChange={(value) => {
                setFormData({...formData, schedule: value});
                setSelectedDays([]); // Reset selected days when schedule changes
              }}>
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

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'open' | 'ongoing' | 'done') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.schedule && (
            <div>
              <Label>
                {formData.schedule === 'weekly' ? 'Days of the Week' : 
                 formData.schedule === 'monthly' ? 'Days of the Month' : 
                 'Days'}
              </Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {(formData.schedule === 'weekly' ? weekdays : 
                  formData.schedule === 'monthly' ? monthDays : 
                  weekdays).map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="text-sm">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Administration' : 'Create Administration'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}