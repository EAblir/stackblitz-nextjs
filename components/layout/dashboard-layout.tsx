'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function DashboardLayout({ children, sidebarOpen, setSidebarOpen }: DashboardLayoutProps) {
    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
            <main className="flex-1 flex overflow-hidden bg-gray-50">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}