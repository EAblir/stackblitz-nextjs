'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, Calendar, BarChart3 } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  description: string;
  category: string;
  type: 'standard' | 'custom';
  frequency: string;
  lastGenerated: string;
  icon: string;
}

const reports: Report[] = [
  {
    id: 1,
    name: 'Profit & Loss Statement',
    description: 'Comprehensive income statement showing revenue and expenses',
    category: 'financial',
    type: 'standard',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    icon: '📈'
  },
  {
    id: 2,
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity at a specific point in time',
    category: 'financial',
    type: 'standard',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    icon: '⚖️'
  },
  {
    id: 3,
    name: 'Cash Flow Statement',
    description: 'Track cash inflows and outflows over time',
    category: 'financial',
    type: 'standard',
    frequency: 'Monthly',
    lastGenerated: '2024-01-14',
    icon: '💰'
  },
  {
    id: 4,
    name: 'VAT Return',
    description: 'Value Added Tax calculations and submissions',
    category: 'tax',
    type: 'standard',
    frequency: 'Quarterly',
    lastGenerated: '2024-01-01',
    icon: '🧾'
  },
  {
    id: 5,
    name: 'Accounts Receivable Aging',
    description: 'Outstanding customer invoices by age',
    category: 'operational',
    type: 'standard',
    frequency: 'Weekly',
    lastGenerated: '2024-01-15',
    icon: '📋'
  },
  {
    id: 6,
    name: 'Expense Analysis',
    description: 'Detailed breakdown of business expenses by category',
    category: 'operational',
    type: 'custom',
    frequency: 'Monthly',
    lastGenerated: '2024-01-12',
    icon: '💸'
  }
];

interface ReportsGridProps {
  searchQuery: string;
  categoryFilter: string;
}

export function ReportsGrid({ searchQuery, categoryFilter }: ReportsGridProps) {
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial':
        return 'bg-blue-100 text-blue-800';
      case 'tax':
        return 'bg-green-100 text-green-800';
      case 'operational':
        return 'bg-orange-100 text-orange-800';
      case 'compliance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReports.map((report) => (
        <Card key={report.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{report.icon}</div>
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{report.name}</span>
                    {report.type === 'custom' && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        Custom
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge className={`text-xs ${getCategoryColor(report.category)}`}>
                    {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>{report.description}</CardDescription>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{report.frequency}</span>
              </div>
              <span>Last: {report.lastGenerated}</span>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredReports.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No reports found matching your criteria.
        </div>
      )}
    </div>
  );
}