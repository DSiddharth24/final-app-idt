'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    BarChart3,
    Users,
    Settings,
    Map as MapIcon,
    Cpu,
    Clock,
    TrendingUp,
    AlertCircle,
    FileSearch,
    Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    role: 'MANAGER' | 'SUPERVISOR' | 'WORKER'
}

export default function DashboardSidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const links = {
        MANAGER: [
            { name: 'Analytics', href: '/dashboard/manager', icon: BarChart3 },
            { name: 'Workforce', href: '/dashboard/manager/workforce', icon: Users },
            { name: 'Plantations', href: '/dashboard/manager/plantations', icon: MapIcon },
            { name: 'IoT Devices', href: '/dashboard/manager/devices', icon: Cpu },
            { name: 'Payroll', href: '/dashboard/manager/payroll', icon: Wallet },
            { name: 'Audit Logs', href: '/dashboard/manager/audit', icon: FileSearch },
        ],
        SUPERVISOR: [
            { name: 'Live View', href: '/dashboard/supervisor', icon: Clock },
            { name: 'Alerts', href: '/dashboard/supervisor/alerts', icon: AlertCircle },
            { name: 'Attendance', href: '/dashboard/supervisor/attendance', icon: TrendingUp },
        ],
        WORKER: [
            { name: 'Overview', href: '/dashboard/worker', icon: Clock },
            { name: 'History', href: '/dashboard/worker/history', icon: FileSearch },
            { name: 'Earnings', href: '/dashboard/worker/earnings', icon: Wallet },
        ]
    }

    const activeLinks = links[role]

    return (
        <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col h-full sticky top-16">
            <div className="flex-1 py-6 px-4 space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">
                    Management
                </div>
                {activeLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-green-50 text-green-700 shadow-sm shadow-green-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-green-600" : "text-gray-400")} />
                            <span>{link.name}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-4 text-white shadow-lg shadow-green-100">
                    <div className="text-xs font-medium opacity-80 mb-1">Active Plan</div>
                    <div className="text-sm font-bold mb-3 uppercase tracking-tighter">Enterprise Suite</div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
