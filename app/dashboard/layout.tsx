import RouteGuard from "@/components/routeguard/routeguard"
import { Sidebar, SidebarMenuItems } from "@/components/sidebar/sidebar"
import { BellRing, FileBadge, LucideBook, Users } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
}

const menus: Array<SidebarMenuItems> = [
    {
        title: "",
        name: "Questionnaires",
        icon: <LucideBook size={18} />,
        url: "/dashboard/questionnaires",
    },
    {
        title: "",
        name: "Rewards",
        icon: <FileBadge size={19} />,
        url: "/dashboard/rewards",
    },
    {
        title: "",
        name: "Patients",
        icon: <Users size={18} />,
        url: "/dashboard/patients",
    },
    {
        title: "",
        name: "Notifications",
        icon: <BellRing size={18} />,
        url: "/dashboard/notifications",
    },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RouteGuard>
            <section className="">
                <Sidebar menuItems={menus} />
                <div className="overflow-auto p-4 mt-16 sm:ml-64 bg-gray-100 h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                </div>
            </section>
        </RouteGuard>
    )
}
