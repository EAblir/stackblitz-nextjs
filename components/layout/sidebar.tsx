'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Workflow, 
  Plug, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [administrationOpen, setAdministrationOpen] = useState(false);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/messages/count')
      .then(res => res.json())
      .then(data => setMessageCount(data.count))
      .catch(() => setMessageCount(0));
  }, []);

  const menuItems = [
    { 
      name: 'Messages', 
      href: '/messages', 
      icon: MessageSquare, 
      badge: messageCount 
    },
    { 
      name: 'Workflows', 
      href: '/workflows', 
      icon: Workflow 
    },
    { 
      name: 'Integrations', 
      href: '/integrations', 
      icon: Plug 
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: BarChart3 
    },
    { 
      name: 'Administration', 
      href: '', 
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { name: 'Instructions', href: '/administration/instructions' },
        { name: 'Administrations', href: '/administration/administrations' },
        { name: 'Users', href: '/administration/users' }
      ]
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      isOpen ? "w-64" : "w-20"
    )}>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => {
                if (item.hasSubmenu) {
                  setAdministrationOpen(!administrationOpen);
                }
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <>
                  <span className="ml-3 flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-100 text-red-600 text-xs rounded-full px-2 py-1 ml-2">
                      {item.badge}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronDown className={cn(
                      "w-4 h-4 ml-2 transition-transform",
                      administrationOpen && "rotate-180"
                    )} />
                  )}
                </>
              )}
            </Link>
            
            {item.hasSubmenu && administrationOpen && isOpen && (
              <div className="ml-8 mt-2 space-y-1">
                {item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === subItem.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}