import { Metadata } from 'next';
import { ProfileSidebar, SidebarMenuItems } from "../profile/_components/sidebar/sidebar"
import { BellRing, FileBadge, LucideBook, Users } from "lucide-react"

export const metadata: Metadata = {
  title: 'Profile | Inuwell Admin Dashboard',
  description: 'View and modify your profile details.',
};

const profileMenus: Array<SidebarMenuItems> = [
  {
    title: "",
    name: "Personal Profile",
    icon: <LucideBook size={18} />,
    url: "/dashboard/profile/personal",
  },
  {
    title: "",
    name: "Notifications",
    icon: <BellRing size={18} />,
    url: "/dashboard/profile/personalNotifications",
  },
]


export default function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section>
        <ProfileSidebar menuItems={profileMenus} />
        <div className="overflow-auto sm:ml-64 bg-gray-100 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </div>
      </section>
    </>
  );
}
