import { createClient } from '@/lib/supabase/server'
import {
    Users,
    Clock,
    Cpu,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Activity
} from 'lucide-react'

export default async function ManagerDashboard() {
    const supabase = await createClient()

    // In a real app, we would fetch aggregate data here
    // For now, we'll use semi-mock data to show the intended UI

    const stats = [
        { name: 'Active Workers', value: '412', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Avg. Shift Hours', value: '8.4h', change: '+2.1%', icon: Clock, iconColor: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Devices Online', value: '18/20', change: 'Stable', icon: Cpu, iconColor: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Productivity', value: '94%', change: '+4%', icon: Activity, iconColor: 'text-orange-600', bg: 'bg-orange-50' },
    ]

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manager Dashboard</h1>
                    <p className="text-gray-500 text-sm">Real-time overview of your plantation workforce and IoT fleet.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                    <button className="px-4 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg shadow-sm">Last 7 Days</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Last 30 Days</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.iconColor || 'text-green-600'}`} />
                            </div>
                            <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.change}
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-gray-900">Attendance Trends</h3>
                            <p className="text-xs text-gray-400">Worker check-ins vs check-outs over time</p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-gray-300" />
                    </div>

                    <div className="h-64 flex items-end justify-between space-x-2 px-2">
                        {[45, 62, 58, 75, 90, 82, 95].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full bg-green-50 rounded-t-lg transition-all duration-500 group-hover:bg-green-100" style={{ height: `${val}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {val}% Presence
                                    </div>
                                </div>
                                <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Day {i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Logs / Recent Activity */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Recent Taps</h3>
                        <Calendar className="h-5 w-5 text-gray-300" />
                    </div>

                    <div className="space-y-6 flex-1">
                        {[
                            { user: 'S. Ramaswamy', time: '2m ago', type: 'IN', zone: 'Zone A-12' },
                            { user: 'K. Pillai', time: '5m ago', type: 'OUT', zone: 'Zone B-04' },
                            { user: 'M. Ibrahim', time: '12m ago', type: 'IN', zone: 'Zone A-08' },
                            { user: 'P. Nair', time: '18m ago', type: 'IN', zone: 'Zone C-01' },
                            { user: 'L. Gomez', time: '22m ago', type: 'OUT', zone: 'Zone B-04' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-10 rounded-full ${log.type === 'IN' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{log.user}</div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase">{log.zone}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${log.type === 'IN' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                        {log.type}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-green-600 border-t border-gray-50 transition-colors">
                        View All Logs
                    </button>
                </div>
            </div>
        </div>
    )
}
