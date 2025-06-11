'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HelpCircle, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Message {
  id: number;
  type: 'question' | 'feedback';
  status: 'open' | 'answered' | 'resolved';
  administrationName: string;
  invoiceNumber: string;
  fields: string;
  message: string;
  assignee: string;
  created: string;
}

const messages: Message[] = [
  {
    id: 1,
    type: 'question',
    status: 'open',
    administrationName: 'Acme Corp',
    invoiceNumber: 'INV-2024-001',
    fields: 'Invoice number, G/L code',
    message: 'Need clarification on the VAT calculation for this invoice.',
    assignee: 'John Doe',
    created: '2024-01-15'
  },
  {
    id: 2,
    type: 'feedback',
    status: 'resolved',
    administrationName: 'TechStart Inc',
    invoiceNumber: 'INV-2024-002',
    fields: 'VAT code',
    message: 'The VAT rate seems incorrect for EU transactions.',
    assignee: 'Sarah Johnson',
    created: '2024-01-14'
  },
  {
    id: 3,
    type: 'question',
    status: 'answered',
    administrationName: 'Global Solutions',
    invoiceNumber: 'INV-2024-003',
    fields: 'G/L code',
    message: 'Which account should be used for office supplies?',
    assignee: 'Mike Chen',
    created: '2024-01-13'
  }
];

interface MessagesTableProps {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
}

export function MessagesTable({ searchQuery, typeFilter, statusFilter }: MessagesTableProps) {
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.administrationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    return type === 'question' ? (
      <HelpCircle className="w-4 h-4 text-blue-600" />
    ) : (
      <MessageCircle className="w-4 h-4 text-green-600" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'answered':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800';
      case 'answered':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-700">Type</th>
            <th className="text-left p-4 font-medium text-gray-700">Status</th>
            <th className="text-left p-4 font-medium text-gray-700">Administration</th>
            <th className="text-left p-4 font-medium text-gray-700">Invoice #</th>
            <th className="text-left p-4 font-medium text-gray-700">Fields</th>
            <th className="text-left p-4 font-medium text-gray-700">Message</th>
            <th className="text-left p-4 font-medium text-gray-700">Assignee</th>
            <th className="text-left p-4 font-medium text-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((message) => (
            <tr key={message.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(message.type)}
                  <span className="capitalize">{message.type}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge className={`flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                  {getStatusIcon(message.status)}
                  <span className="capitalize">{message.status}</span>
                </Badge>
              </td>
              <td className="p-4 font-medium">{message.administrationName}</td>
              <td className="p-4 font-mono text-sm">{message.invoiceNumber}</td>
              <td className="p-4 text-sm text-gray-600">{message.fields}</td>
              <td className="p-4 max-w-xs truncate" title={message.message}>
                {message.message}
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {message.assignee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{message.assignee}</span>
                </div>
              </td>
              <td className="p-4 text-sm text-gray-600">{message.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredMessages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No messages found matching your criteria.
        </div>
      )}
    </div>
  );
}