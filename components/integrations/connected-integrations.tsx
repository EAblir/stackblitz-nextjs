'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Unplug, Activity } from 'lucide-react';

interface ConnectedIntegration {
  id: number;
  name: string;
  description: string;
  category: string;
  logo: string;
  status: 'active' | 'error' | 'syncing';
  lastSync: string;
  dataPoints: number;
}

const connectedIntegrations: ConnectedIntegration[] = [
  {
    id: 1,
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    category: 'Payments',
    logo: '💳',
    status: 'active',
    lastSync: '2 minutes ago',
    dataPoints: 1247
  },
  {
    id: 2,
    name: 'QuickBooks',
    description: 'Accounting data synchronization',
    category: 'Accounting',
    logo: '📊',
    status: 'syncing',
    lastSync: 'Syncing now...',
    dataPoints: 892
  },
  {
    id: 3,
    name: 'Slack',
    description: 'Team notifications and alerts',
    category: 'Communication',
    logo: '💬',
    status: 'error',
    lastSync: '2 hours ago',
    dataPoints: 45
  }
];

interface ConnectedIntegrationsProps {
  searchQuery: string;
}

export function ConnectedIntegrations({ searchQuery }: ConnectedIntegrationsProps) {
  const filteredIntegrations = connectedIntegrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-3 h-3" />;
      case 'syncing':
        return <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {filteredIntegrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{integration.logo}</div>
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  <span className="capitalize">{integration.status}</span>
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Unplug className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Last sync: {integration.lastSync}</span>
                <span>•</span>
                <span>{integration.dataPoints.toLocaleString()} data points</span>
              </div>
              <Badge variant="outline">{integration.category}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No connected integrations found matching your search.' : 'No integrations connected yet.'}
        </div>
      )}
    </div>
  );
}