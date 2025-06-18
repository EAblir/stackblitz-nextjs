'use client';

import { useEffect, useState } from 'react';
import { MainNav } from '@/components/layout/mainnav';
import { UsersTable, User } from '@/components/administration/users-table';
import { UserFormSheet } from '@/components/administration/user-form-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from API
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'));
  }, []);

  const handleSaveUser = async (userData: User) => {
    if (editingUser) {
      // Update user
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
        toast.success('User updated');
      } else {
        toast.error('Failed to update user');
      }
    } else {
      // Create user
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers(prev => [...prev, newUser]);
        toast.success('User created');
      } else {
        toast.error('Failed to create user');
      }
    }
    setShowFormSheet(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowFormSheet(true);
  };

  const handleDeleteUser = async (id: number) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted');
    } else {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setShowFormSheet(true);
  };

  return (
    <MainNav 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    >
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
          onCloseAction={() => {
            setShowFormSheet(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSaveAction={handleSaveUser}
        />
      </div>
    </MainNav>
  );
}