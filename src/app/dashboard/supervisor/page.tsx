import { createClient } from '@/lib/supabase/server'
import {
    Users,
    Clock,
    MapPin,
    AlertTriangle,
    ArrowRight,
    ShieldAlert
} from 'lucide-react'

export default async function SupervisorDashboard() {
    const supabase = await createClient()

    // Mock data for live view
    const activeWorkers = [
        { name: 'Arun Kumar', tapTime: '08:12 AM', zone: 'Section A-1', status: 'Working' },
        { name: 'Meena Bai', tapTime: '08:15 AM', zone: 'Section A-1', status: 'Working' },
        { name: 'Suresh Raina', tapTime: '08:20 AM', zone: 'Section A-2', status: 'Working' },
        { name: 'Lakshmi Devi', tapTime: '08:45 AM', zone: 'Section A-3', status: 'Working' },
    ]

    const alerts = [
        { type: 'OFFLINE', device: 'ESP-Reader-04', zone: 'Section A-4', time: '10m ago' },
        { type: 'LATE', worker: 'R. Rajesh', zone: 'Section A-2', time: 'Shift start: 08:00 AM' },
    ]

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Supervisor Portal</h1>
                <p className="text-gray-500 text-sm">Managing Section A - Coffee Blocks 1-4</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Attendance Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-green-50/30">
                            <h3 className="font-bold text-gray-900 flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-green-600" />
                                Currently On-Site
                            </h3>
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                                {activeWorkers.length} Active
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        <th className="px-6 py-4">Worker</th>
                                        <th className="px-6 py-4">Check-in</th>
                                        <th className="px-6 py-4">Block</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activeWorkers.map((worker, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                        {worker.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{worker.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{worker.tapTime}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                <div className="flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1 text-gray-300" />
                                                    {worker.zone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-green-600 hover:text-green-700 font-bold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                                                    Details <ArrowRight className="ml-1 h-3 w-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Alerts & Exceptions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center">
                                <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
                                Critical Alerts
                            </h3>
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                        </div>

                        <div className="space-y-4">
                            {alerts.map((alert, i) => (
                                <div key={i} className="p-4 rounded-xl border border-red-50 bg-red-50/30">
                                    <div className="flex items-center text-red-700 font-bold text-xs mb-1">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {alert.type}
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">{alert.device || alert.worker}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
                                        <span>{alert.zone}</span>
                                        <span>{alert.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 w-full py-3 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all">
                            Acknowledge All
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white">
                        <h4 className="text-sm font-bold mb-2">Device Status</h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-4">
                            <span>3 Gateways Active</span>
                            <span>1 Maintenance Required</span>
                        </div>
                        <div className="space-y-2">
                            {[80, 45, 90].map((w, i) => (
                                <div key={i} className="h-1 w-full bg-white/10 rounded-full">
                                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${w}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
