'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AdministrationsTable, Administration } from '@/components/administration/administrations-table';
import { AdministrationFormSheet } from '@/components/administration/administration-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { downloadExcel, downloadPDF } from '@/lib/export-utils';

export default function AdministrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingAdministration, setEditingAdministration] = useState<Administration | null>(null);
  const [administrations, setAdministrations] = useState<Administration[]>([]);
  const [allAdministrations, setAllAdministrations] = useState<Administration[]>([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch administrations from API
  useEffect(() => {
    fetchAdministrations();
  }, []);

  // Filter administrations based on selected company
  useEffect(() => {
    if (selectedCompanyId) {
      const filtered = allAdministrations.filter(admin => 
        admin.companyId === selectedCompanyId
      );
      setAdministrations(filtered);
    } else {
      setAdministrations(allAdministrations);
    }
  }, [selectedCompanyId, allAdministrations]);

  const fetchAdministrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/administrations');
      if (response.ok) {
        const data = await response.json();
        setAllAdministrations(data);
        setAdministrations(data);
      } else {
        toast.error('Failed to load administrations');
      }
    } catch (error) {
      console.error('Error fetching administrations:', error);
      toast.error('Failed to load administrations');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdministration = async (administrationData: Administration) => {
    try {
      if (editingAdministration) {
        // Update existing administration
        const response = await fetch('/api/administrations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...administrationData,
            companyId: selectedCompanyId
          }),
        });

        if (response.ok) {
          const updatedAdmin = await response.json();
          setAllAdministrations(prev => prev.map(admin => 
            admin.id === updatedAdmin.id ? updatedAdmin : admin
          ));
          toast.success('Administration updated successfully');
        } else {
          toast.error('Failed to update administration');
          return;
        }
      } else {
        // Add new administration
        const response = await fetch('/api/administrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...administrationData,
            companyId: selectedCompanyId
          }),
        });

        if (response.ok) {
          const newAdmin = await response.json();
          setAllAdministrations(prev => [...prev, newAdmin]);
          toast.success('Administration created successfully');
        } else {
          toast.error('Failed to create administration');
          return;
        }
      }

      setShowFormSheet(false);
      setEditingAdministration(null);
    } catch (error) {
      console.error('Error saving administration:', error);
      toast.error('Failed to save administration');
    }
  };

  const handleEditAdministration = (administration: Administration) => {
    setEditingAdministration(administration);
    setShowFormSheet(true);
  };

  const handleDeleteAdministration = async (id: number) => {
    try {
      const response = await fetch('/api/administrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAllAdministrations(prev => prev.filter(admin => admin.id !== id));
        toast.success('Administration deleted successfully');
      } else {
        toast.error('Failed to delete administration');
      }
    } catch (error) {
      console.error('Error deleting administration:', error);
      toast.error('Failed to delete administration');
    }
  };

  const handleCreateNew = () => {
    if (!selectedCompanyId) {
      toast.error('Please select a company first');
      return;
    }
    setEditingAdministration(null);
    setShowFormSheet(true);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setExporting(true);
      if (format === 'excel') {
        await downloadExcel('administrations');
        toast.success('Excel file downloaded successfully');
      } else {
        await downloadPDF('administrations');
        toast.success('PDF export opened in new window');
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={setSelectedCompanyId}
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading administrations...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administrations</h1>
            {selectedCompanyId && (
              <p className="text-gray-600 mt-1">
                Showing administrations for selected company
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleCreateNew} disabled={!selectedCompanyId}>
              <Plus className="w-4 h-4 mr-2" />
              Create Administration
            </Button>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleExport('excel')}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Excel'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {!selectedCompanyId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Please select a company from the dropdown in the top bar to view and manage administrations.
            </p>
          </div>
        )}

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