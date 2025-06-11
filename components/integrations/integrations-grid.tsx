'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';

interface Integration {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  logo: string;
  popular: boolean;
  connected: boolean;
}

const integrations: Integration[] = [
  {
    id: 1,
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions',
    category: 'Payments',
    rating: 4.8,
    reviews: 1250,
    logo: '💳',
    popular: true,
    connected: false
  },
  {
    id: 2,
    name: 'QuickBooks',
    description: 'Sync accounting data and transactions',
    category: 'Accounting',
    rating: 4.6,
    reviews: 890,
    logo: '📊',
    popular: true,
    connected: false
  },
  {
    id: 3,
    name: 'Slack',
    description: 'Get notifications and updates in Slack',
    category: 'Communication',
    rating: 4.7,
    reviews: 2100,
    logo: '💬',
    popular: false,
    connected: false
  },
  {
    id: 4,
    name: 'Google Drive',
    description: 'Store and sync documents automatically',
    category: 'Storage',
    rating: 4.5,
    reviews: 3200,
    logo: '📁',
    popular: false,
    connected: false
  },
  {
    id: 5,
    name: 'Xero',
    description: 'Cloud-based accounting software integration',
    category: 'Accounting',
    rating: 4.4,
    reviews: 670,
    logo: '🧮',
    popular: false,
    connected: false
  },
  {
    id: 6,
    name: 'PayPal',
    description: 'Process PayPal payments and transactions',
    category: 'Payments',
    rating: 4.3,
    reviews: 980,
    logo: '💰',
    popular: false,
    connected: false
  }
];

interface IntegrationsGridProps {
  searchQuery: string;
}

export function IntegrationsGrid({ searchQuery }: IntegrationsGridProps) {
  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Payments':
        return 'bg-green-100 text-green-800';
      case 'Accounting':
        return 'bg-blue-100 text-blue-800';
      case 'Communication':
        return 'bg-purple-100 text-purple-800';
      case 'Storage':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredIntegrations.map((integration) => (
        <Card key={integration.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.logo}</div>
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{integration.name}</span>
                    {integration.popular && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge className={`text-xs ${getCategoryColor(integration.category)}`}>
                    {integration.category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>{integration.description}</CardDescription>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{integration.rating}</span>
              </div>
              <span>•</span>
              <span>{integration.reviews.toLocaleString()} reviews</span>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                Connect
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredIntegrations.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No integrations found matching your search.
        </div>
      )}
    </div>
  );
}