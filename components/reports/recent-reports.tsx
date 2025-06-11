'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, Share } from 'lucide-react';

interface RecentReport {
  id: number;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'failed';
  generated: string;
  size: string;
  format: string;
}

const recentReports: RecentReport[] = [
  {
    id: 1,
    name: 'Profit & Loss Statement - January 2024',
    type: 'Financial',
    status: 'completed',
    generated: '2024-01-15 14:30',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'VAT Return Q4 2023',
    type: 'Tax',
    status: 'completed',
    generated: '2024-01-15 10:15',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'Cash Flow Analysis - December',
    type: 'Financial',
    status: 'processing',
    generated: '2024-01-15 09:45',
    size: '-',
    format: 'PDF'
  },
  {
    id: 4,
    name: 'Expense Report - Q4 2023',
    type: 'Operational',
    status: 'completed',
    generated: '2024-01-14 16:20',
    size: '3.1 MB',
    format: 'Excel'
  },
  {
    id: 5,
    name: 'Balance Sheet - December 2023',
    type: 'Financial',
    status: 'failed',
    generated: '2024-01-14 11:30',
    size: '-',
    format: 'PDF'
  }
];

interface RecentReportsProps {
  searchQuery: string;
}

export function RecentReports({ searchQuery }: RecentReportsProps) {
  const filteredReports = recentReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {filteredReports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{report.type}</Badge>
                  <Badge className={`flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                {report.status === 'completed' && (
                  <>
                    <Button variant="outline\" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </>
                )}
                {report.status === 'failed' && (
                  <Button variant="outline" size="sm">
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Generated: {report.generated}</span>
                {report.size !== '-' && (
                  <>
                    <span>•</span>
                    <span>Size: {report.size}</span>
                  </>
                )}
                <span>•</span>
                <span>Format: {report.format}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No recent reports found matching your search.' : 'No recent reports available.'}
        </div>
      )}
    </div>
  );
}