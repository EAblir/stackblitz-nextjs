'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '/images/logo.png';

import { Menu, ChevronDown, Globe, User, Settings, LogOut, ListTree} from 'lucide-react';

interface Company {
    id: number;
    name: string;
}

interface TopBarProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
    selectedCompanyId?: number;
    onCompanyChange?: (companyId: number) => void;
}

export function TopBar({ onMenuClick, isSidebarOpen, selectedCompanyId, onCompanyChange }: TopBarProps) {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (companies.length > 0 && selectedCompanyId) {
            const company = companies.find(c => c.id === selectedCompanyId);
            if (company) {
                setCurrentCompany(company);
            }
        } else if (companies.length > 0 && !currentCompany) {
            // Set first company as default if none selected
            setCurrentCompany(companies[0]);
            onCompanyChange?.(companies[0].id);
        }
    }, [companies, selectedCompanyId, currentCompany, onCompanyChange]);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompanyChange = (company: Company) => {
        setCurrentCompany(company);
        onCompanyChange?.(company.id);
    };

    const handleUserSettingsClick = () => {
        router.push('/administration/users');
    };

    return (
        <div
            className="border-b px-6 py-4"
            style={{
                backgroundColor: '#253651',
                borderColor: '#253651'
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="ml-0 hover:text-[#31446a] text-white"
                        aria-label="Expand sidebar"
                    >
                        <ListTree className="w-5 h-5"/>
                    </Button>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Link href="/">
                                <Image
                                    alt="Logo"
                                    src={Logo}
                                    height={36}
                                />
                            </Link>
                        </div>

                        {!loading && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2 hover:text-[#31446a] text-white">
                                        <span className="font-medium">
                                            {currentCompany?.name || 'Select Company'}
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    {companies.map((company) => (
                                        <DropdownMenuItem
                                            key={company.id}
                                            onClick={() => handleCompanyChange(company)}
                                            className={currentCompany?.id === company.id ? 'bg-blue-50' : ''}
                                        >
                                            {company.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-3 hover:bg-[#31446a]">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <div className="text-sm text-white font-medium">John Doe</div>
                                <div className="text-xs text-gray-200">Administrator</div>
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2">
                            <div className="text-sm font-medium">John Doe</div>
                            <div className="text-xs text-gray-500">john.doe@company.com</div>
                            <div className="text-xs text-gray-500">Administrator</div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleUserSettingsClick}>
                            <User className="w-4 h-4 mr-2" />
                            User Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Preferences
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}