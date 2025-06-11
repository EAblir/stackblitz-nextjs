'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HelpCircle, MessageCircle, CheckCircle, Clock, AlertCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface Message {
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

interface MessagesTableProps {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
  messages: Message[];
  onEdit: (message: Message) => void;
  onDelete: (id: number) => void;
}

export function MessagesTable({ 
  searchQuery, 
  typeFilter, 
  statusFilter, 
  messages, 
  onEdit, 
  onDelete 
}: MessagesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      onDelete(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  return (
    <>
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
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
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
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(message)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(message.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}