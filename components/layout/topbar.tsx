'use client';

import { useState } from 'react';
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
import Logo from '/images/logo.png';

import { Menu, ChevronDown, Globe, User, Settings, LogOut, ListTree} from 'lucide-react';

interface TopBarProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

export function TopBar({ onMenuClick, isSidebarOpen }: TopBarProps) {
    const [currentCompany, setCurrentCompany] = useState('Acme Corporation');
    const [showBrowserAgent, setShowBrowserAgent] = useState(false);

    const companies = [
        'Acme Corporation',
        'TechStart Inc.',
        'Global Solutions Ltd.',
        'Innovation Co.',
    ];

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
                            <a href="/">
                            <Image
                                alt="Logo"
                                src={Logo}
                                height={36}
                                />
                            </a>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 hover:text-[#31446a] text-white">
                                    <span className="font-medium">{currentCompany}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                {companies.map((company) => (
                                    <DropdownMenuItem
                                        key={company}
                                        onClick={() => setCurrentCompany(company)}
                                        className={currentCompany === company ? 'bg-blue-50' : ''}
                                    >
                                        {company}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                        <DropdownMenuItem>
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