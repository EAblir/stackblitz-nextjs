'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { WorkflowsTable } from '@/components/workflows/workflows-table';
import { CreateWorkflowModal } from '@/components/workflows/create-workflow-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Search, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { downloadExcel, downloadPDF } from '@/lib/export-utils';

export default function WorkflowsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setExporting(true);
      if (format === 'excel') {
        await downloadExcel('workflows');
        toast.success('Excel file downloaded successfully');
      } else {
        await downloadPDF('workflows');
        toast.success('PDF export opened in new window');
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
            <p className="text-gray-600 mt-1">Automate your accounting processes</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Active Workflows</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
              </div>
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Paused Workflows</h3>
                <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
              </div>
              <Pause className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Total Executions</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">1,247</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <WorkflowsTable 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </div>

        <CreateWorkflowModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </DashboardLayout>
  );
}