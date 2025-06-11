'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface CreateAdministrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAdministrationModal({ isOpen, onClose }: CreateAdministrationModalProps) {
  const [formData, setFormData] = useState({
    accountingOffice: '',
    administrationName: '',
    schedule: '',
    days: []
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthDays = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

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

    const submissionData = {
      ...formData,
      days: selectedDays
    };

    console.log('Creating administration:', submissionData);
    toast.success('Administration created successfully');
    onClose();
    
    setFormData({
      accountingOffice: '',
      administrationName: '',
      schedule: '',
      days: []
    });
    setSelectedDays([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Administration</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Create Administration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}