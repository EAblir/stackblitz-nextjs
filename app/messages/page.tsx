'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MessagesTable, Message } from '@/components/messages/messages-table';
import { MessageFormSheet } from '@/components/messages/message-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

const initialMessages: Message[] = [
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

export default function MessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSaveMessage = (messageData: Message) => {
    if (editingMessage) {
      // Update existing message
      setMessages(prev => prev.map(msg => 
        msg.id === messageData.id ? messageData : msg
      ));
    } else {
      // Add new message
      setMessages(prev => [...prev, messageData]);
    }
    setShowFormSheet(false);
    setEditingMessage(null);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setShowFormSheet(true);
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    toast.success('Message deleted successfully');
  };

  const handleCreateNew = () => {
    setEditingMessage(null);
    setShowFormSheet(true);
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Message
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="question">Questions</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <MessagesTable 
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            messages={messages}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        </div>

        <MessageFormSheet 
          isOpen={showFormSheet}
          onClose={() => {
            setShowFormSheet(false);
            setEditingMessage(null);
          }}
          message={editingMessage}
          onSave={handleSaveMessage}
        />
      </div>
    </DashboardLayout>
  );
}