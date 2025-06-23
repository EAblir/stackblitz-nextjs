'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { Loader2 } from 'lucide-react';

interface MainNavProps {
    children: React.ReactNode;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    selectedCompanyId?: number;
    onCompanyChange?: (companyId: number) => void;
}

export function MainNav({ 
    children, 
    sidebarOpen, 
    setSidebarOpen, 
    selectedCompanyId, 
    onCompanyChange 
}: MainNavProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (!session) {
            router.replace('/login');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to login
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <TopBar 
                onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
                isSidebarOpen={sidebarOpen}
                selectedCompanyId={selectedCompanyId}
                onCompanyChange={onCompanyChange}
                session={session}
            />
            <main className="flex-1 flex overflow-hidden bg-gray-50">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}