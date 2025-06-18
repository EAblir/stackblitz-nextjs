'use client';

import { useState } from 'react';
import { MainNav } from '@/components/layout/mainnav';
import { ReportsGrid } from '@/components/reports/reports-grid';
import { RecentReports } from '@/components/reports/recent-reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  return (
    <MainNav 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Generate insights from your financial data</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Total Reports</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">24</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Generated Today</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">7</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Scheduled</h3>
                <p className="text-2xl font-bold text-orange-600 mt-1">5</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Custom Reports</h3>
                <p className="text-2xl font-bold text-purple-600 mt-1">3</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="available">Available Reports</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="available" className="space-y-6">
            <ReportsGrid searchQuery={searchQuery} categoryFilter={categoryFilter} />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentReports searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </MainNav>
  );
}