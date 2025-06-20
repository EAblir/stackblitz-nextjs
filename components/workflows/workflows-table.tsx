'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, Edit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Company {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Workflow {
  id: number;
  name: string;
  description: string;
  trigger: string;
  schedule?: string;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  executions: number;
  created: string;
  company?: Company;
  user?: User;
  _count?: {
    steps: number;
  };
}

interface WorkflowsTableProps {
  searchQuery: string;
  statusFilter: string;
}

export function WorkflowsTable({ searchQuery, statusFilter }: WorkflowsTableProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
      } else {
        toast.error('Failed to load workflows');
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-700">Workflow</th>
            <th className="text-left p-4 font-medium text-gray-700">Company</th>
            <th className="text-left p-4 font-medium text-gray-700">Trigger</th>
            <th className="text-left p-4 font-medium text-gray-700">Status</th>
            <th className="text-left p-4 font-medium text-gray-700">Last Run</th>
            <th className="text-left p-4 font-medium text-gray-700">Executions</th>
            <th className="text-left p-4 font-medium text-gray-700">Steps</th>
            <th className="text-left p-4 font-medium text-gray-700">Created By</th>
            <th className="text-left p-4 font-medium text-gray-700">Created</th>
            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkflows.map((workflow) => (
            <tr key={workflow.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-4">
                <div>
                  <div className="font-medium text-gray-900">{workflow.name}</div>
                  <div className="text-sm text-gray-600">{workflow.description}</div>
                </div>
              </td>
              <td className="p-4">
                <span className="text-sm text-gray-900">
                  {workflow.company?.name || 'No Company'}
                </span>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {workflow.trigger}
                  {workflow.schedule && ` (${workflow.schedule})`}
                </span>
              </td>
              <td className="p-4">
                <Badge className={`flex items-center space-x-1 w-fit ${getStatusColor(workflow.status)}`}>
                  {getStatusIcon(workflow.status)}
                  <span className="capitalize">{workflow.status}</span>
                </Badge>
              </td>
              <td className="p-4 text-sm text-gray-600">{formatDate(workflow.lastRun)}</td>
              <td className="p-4 font-medium">{workflow.executions.toLocaleString()}</td>
              <td className="p-4 text-sm text-gray-600">{workflow._count?.steps || 0}</td>
              <td className="p-4 text-sm text-gray-600">{workflow.user?.name || 'Unknown'}</td>
              <td className="p-4 text-sm text-gray-600">{formatDate(workflow.created)}</td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        {workflow.status === 'active' ? 'Pause' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No workflows found matching your criteria.
        </div>
      )}
    </div>
  );
}