import RouteGuard from "@/components/routeguard/routeguard"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <RouteGuard>{children}</RouteGuard>
}
