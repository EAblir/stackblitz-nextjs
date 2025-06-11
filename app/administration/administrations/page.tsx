'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AdministrationsTable, Administration } from '@/components/administration/administrations-table';
import { AdministrationFormSheet } from '@/components/administration/administration-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

const initialAdministrations: Administration[] = [
  {
    id: 1,
    accountingOffice: 'Premier Accounting',
    administrationName: 'Acme Corp',
    schedule: 'monthly',
    days: ['1'],
    status: 'open',
    lastModified: '2024-01-15'
  },
  {
    id: 2,
    accountingOffice: 'Financial Partners',
    administrationName: 'TechStart Inc',
    schedule: 'weekly',
    days: ['Friday'],
    status: 'ongoing',
    lastModified: '2024-01-14'
  },
  {
    id: 3,
    accountingOffice: 'Accounting Plus',
    administrationName: 'Global Solutions',
    schedule: 'daily',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'done',
    lastModified: '2024-01-13'
  }
];

export default function AdministrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingAdministration, setEditingAdministration] = useState<Administration | null>(null);
  const [administrations, setAdministrations] = useState<Administration[]>(initialAdministrations);

  const handleSaveAdministration = (administrationData: Administration) => {
    if (editingAdministration) {
      // Update existing administration
      setAdministrations(prev => prev.map(admin => 
        admin.id === administrationData.id ? administrationData : admin
      ));
    } else {
      // Add new administration
      setAdministrations(prev => [...prev, administrationData]);
    }
    setShowFormSheet(false);
    setEditingAdministration(null);
  };

  const handleEditAdministration = (administration: Administration) => {
    setEditingAdministration(administration);
    setShowFormSheet(true);
  };

  const handleDeleteAdministration = (id: number) => {
    setAdministrations(prev => prev.filter(admin => admin.id !== id));
    toast.success('Administration deleted successfully');
  };

  const handleCreateNew = () => {
    setEditingAdministration(null);
    setShowFormSheet(true);
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administrations</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Administration
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search administrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <AdministrationsTable 
            searchQuery={searchQuery}
            administrations={administrations}
            onEdit={handleEditAdministration}
            onDelete={handleDeleteAdministration}
          />
        </div>

        <AdministrationFormSheet 
          isOpen={showFormSheet}
          onClose={() => {
            setShowFormSheet(false);
            setEditingAdministration(null);
          }}
          administration={editingAdministration}
          onSave={handleSaveAdministration}
        />
      </div>
    </DashboardLayout>
  );
}