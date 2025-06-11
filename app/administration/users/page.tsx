'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UsersTable, User } from '@/components/administration/users-table';
import { UserFormSheet } from '@/components/administration/user-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const initialUsers: User[] = [
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

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? userData : user
      ));
    } else {
      // Add new user
      setUsers(prev => [...prev, userData]);
    }
    setShowFormSheet(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowFormSheet(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success('User deleted successfully');
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setShowFormSheet(true);
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <UsersTable 
            searchQuery={searchQuery}
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>

        <UserFormSheet 
          isOpen={showFormSheet}
          onClose={() => {
            setShowFormSheet(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSave={handleSaveUser}
        />
      </div>
    </DashboardLayout>
  );
}