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
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { RedirectType, redirect, usePathname } from 'next/navigation';
import { clearAuthData } from '@/store/auth/Auth';
import { Router } from 'next/router';
import { useGetProfileQuery } from '@/app/redux/apis/authApiQ';

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

export function Sidebar({ className, menuItems = [] }: SidebarProps) {
  const pathname = usePathname();
  //

  const logoutUser = () => {
    clearAuthData();
    redirect('/auth/login', RedirectType.replace);
  };

  const getProfile: any = useGetProfileQuery();
  function imageLoader() {
    return getProfile.data?.user?.profilePictureUrl;
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="" className="flex ms-2 md:me-24">
                <Image
                  src="/assets/icons/inuwell_icon.svg"
                  className="w-10 me-3"
                  alt="FlowBite Logo"
                  width={10}
                  height={10}
                />
                <Image
                  src="/assets/icons/inuwell_text.svg"
                  className="w-24 me-3"
                  alt="FlowBite Logo"
                  width={10}
                  height={10}
                />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {
                      getProfile.data?.user?.profilePictureUrl ? (
                        <Image
                          className="w-8 h-8 rounded-full"
                          src={getProfile.data?.user?.profilePictureUrl}
                          loader={imageLoader}
                          unoptimized={true}
                          alt="user photo"
                          width={10}
                          height={10}
                        />
                      ) : (
                        <Image
                            className="w-8 h-8 rounded-full"
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${`${getProfile.data?.user?.fullName}`}`}
                          alt="user photo"
                          width={10}
                          height={10}
                        />
                      )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-4">
                    <DropdownMenuLabel>
                      <h1>{getProfile.data?.user?.fullName}</h1>
                      <span className="text-gray-500 font-medium">
                        {getProfile.data?.user?.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-gray-600">
                      <Link href={'/dashboard/profile'} className='flex'>
                      <User size={18} className="me-2" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-gray-600"
                      onClick={logoutUser}
                    >
                      <LogOut size={18} className="me-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
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
    // <div
    //   className={cn(
    //     'pb-12 max-w-[280px] w-full h-screen  border-r border-t',
    //     className
    //   )}
    // >
    //   <div className="space-y-4 py-4 px-1 border-b">
    //     <div className=" pb-1">
    //       <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
    //         Dashboard
    //       </h3>
    //     </div>
    //     <div className="pb-1 grid grid-cols-[5fr_1fr]">
    //       <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
    //         {/* Welcome {`${user.user.fullName ?? 'Anonymous'}`} */}
    //       </h3>
    //       <div>
    //         <DropdownMenu>
    //           <DropdownMenuTrigger>
    //             <ChevronRight className="cursor-pointer stroke-slate-500"></ChevronRight>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent className="min-w-[250px]">
    //             <DropdownMenuGroup>
    //               <DropdownMenuItem>
    //                 <div className="flex items-center gap-5">
    //                   <UserCircle2Icon className="w-9 h-9 "></UserCircle2Icon>
    //                   <div>
    //                     <p className="text-lg font-semibold">
    //                       {/* {user.user.fullName} */}
    //                     </p>
    //                     <p className="text-gray-500 text-sm">
    //                       {/* {user.user.projectId ?? 'Dev-project'} */}
    //                     </p>
    //                   </div>
    //                 </div>
    //               </DropdownMenuItem>
    //             </DropdownMenuGroup>
    //             <DropdownMenuSeparator></DropdownMenuSeparator>
    //             <DropdownMenuItem>
    //               <Settings className="w-4 h-4 mr-3"></Settings>
    //               <span>Settings</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuSeparator></DropdownMenuSeparator>
    //             <DropdownMenuItem>
    //               <LogOut className="w-4 h-4 mr-3"></LogOut>
    //               <span>Sign Out</span>
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="py-2">
    //     <ScrollArea className="h-[300px] ">
    //       {menus.map((menu) => {
    //         return (
    //           <>
    //             {typeof menu.title === 'string' && menu.title.length > 0 ? (
    //               <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
    //                 Library
    //               </h2>
    //             ) : (
    //               ''
    //             )}
    //             <div className="space-y-1 p-1">
    //               {menu?.items?.map((item, i) => (
    //                 <Link key={`${item.name}-${i}`} href={item.url ?? ''}>
    //                   <div
    //                     className={`flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md transition-colors `}
    //                   >
    //                     <div className="w-6">
    //                       {typeof item.icon === 'string' ? (
    //                         <img src={item.icon} loading="lazy"></img>
    //                       ) : (
    //                         item.icon
    //                       )}
    //                     </div>
    //                     <p className="text-sm select-none ">{item.name}</p>
    //                   </div>
    //                 </Link>
    //               ))}
    //             </div>
    //           </>
    //         );
    //       })}
    //     </ScrollArea>
    //   </div>
    // </div>
  );
}
