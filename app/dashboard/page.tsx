'use client';

import { useState } from 'react';
import { MainNav } from '@/components/layout/mainnav';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProcessingTimeChart } from '@/components/dashboard/processing-time-chart';
import { LoggedInUsersChart } from '@/components/dashboard/logged-in-users-chart';
import { PlannedAdministrations } from '@/components/dashboard/planned-administrations';
import { Clock, HelpCircle, FileText, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();

  const metrics = [
    {
      title: 'Average processing time',
      value: '2.4 hours',
      change: '+12%',
      trend: 'up' as const,
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Open questions',
      value: '23',
      change: '-5%',
      trend: 'down' as const,
      icon: HelpCircle,
      color: 'orange'
    },
    {
      title: 'Open invoices',
      value: '156',
      change: '+8%',
      trend: 'up' as const,
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Questions/Feedback',
      value: '7',
      change: '+2',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'purple'
    }
  ];

  return (
    <MainNav 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    >
      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProcessingTimeChart />
          <LoggedInUsersChart />
        </div>

        {/* Planned Administrations */}
        <PlannedAdministrations />
      </div>
    </MainNav>
  );
}