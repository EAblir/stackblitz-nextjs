'use client';

import { useState,useEffect } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { useRouter } from 'next/navigation';

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
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        
    }, [router]);

    useEffect(() => {
        const isLoggedIn = document.cookie.includes('auth=1');
        if (!isLoggedIn) {
            router.replace('/login');
        }

        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);
        
        router.events?.on("routeChangeStart", handleStart);
        router.events?.on("routeChangeComplete", handleComplete);
        router.events?.on("routeChangeError", handleComplete);

        return () => {
            router.events?.off("routeChangeStart", handleStart);
            router.events?.off("routeChangeComplete", handleComplete);
            router.events?.off("routeChangeError", handleComplete);
        };
    }, [router]);


    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <TopBar 
                onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
                isSidebarOpen={sidebarOpen}
                selectedCompanyId={selectedCompanyId}
                onCompanyChange={onCompanyChange}
            />
            <main className="flex-1 flex overflow-hidden bg-gray-50">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex-1 overflow-y-auto">
                    {loading && <div className="loading">Loading...</div>}
                    {children}
                </div>
            </main>
        </div>
    );
}