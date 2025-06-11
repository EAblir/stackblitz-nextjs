'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EditUserModal } from './edit-user-modal';
import { Edit, Shield, User } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  created: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    created: '2024-01-01'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
    created: '2024-01-02'
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45',
    created: '2024-01-03'
  }
];

interface UsersTableProps {
  searchQuery: string;
}

export function UsersTable({ searchQuery }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? (
      <Shield className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-gray-600" />
    );
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">User</th>
              <th className="text-left p-4 font-medium text-gray-700">Email</th>
              <th className="text-left p-4 font-medium text-gray-700">Role</th>
              <th className="text-left p-4 font-medium text-gray-700">Status</th>
              <th className="text-left p-4 font-medium text-gray-700">Last Login</th>
              <th className="text-left p-4 font-medium text-gray-700">Created</th>
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{user.email}</td>
                <td className="p-4">
                  <Badge className={`flex items-center space-x-1 w-fit ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="p-4 text-sm text-gray-600">{user.created}</td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  );
}