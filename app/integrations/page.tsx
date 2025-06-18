'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { IntegrationsGrid } from '@/components/integrations/integrations-grid';
import { ConnectedIntegrations } from '@/components/integrations/connected-integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';

export default function IntegrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');

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
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-1">Connect your favorite tools and services</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="available" className="space-y-6">
            <IntegrationsGrid searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="connected" className="space-y-6">
            <ConnectedIntegrations searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}