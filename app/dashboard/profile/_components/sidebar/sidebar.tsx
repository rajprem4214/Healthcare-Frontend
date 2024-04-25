'use client';
import { cn } from '@/lib/utils';
import { LogOut, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { RedirectType, redirect, usePathname } from 'next/navigation';
import { clearAuthData } from '@/store/auth/Auth';
import { Router } from 'next/router';

//

export interface SidebarMenuItems {
    title: string | null;
    name: string;
    onClick?: (item: any) => void;
    url?: string;
    icon?: string | React.ReactNode;
}
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    menuItems: SidebarMenuItems[];
}

export function ProfileSidebar({ className, menuItems = [] }: SidebarProps) {
    const pathname = usePathname();
    //

    return (
        <>
            <aside
                id="logo-sidebar"
                className="fixed top-0 left-64 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                aria-label="Sidebar"
            >
              <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        {menuItems.map((menuItem) => {
                            return (
                                <li key={menuItem.name} className="">
                                    <Link
                                        href={menuItem.url ?? ''}
                                        className={cn(
                                            'flex items-center p-2 text-base rounded-lg text-gray-600 dark:text-white hover:bg-gray-200 hover:text-primary dark:hover:bg-gray-700 group',
                                            {
                                                'bg-gray-200 text-primary': pathname === menuItem.url,
                                            }
                                        )}
                                    >
                                        {menuItem.icon}
                                        <span className="ms-3">{menuItem.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </>
    );
}
