import { createClient } from '@/lib/supabase/server'
import {
    Calendar,
    Clock,
    Wallet,
    Trophy,
    History,
    CheckCircle2
} from 'lucide-react'

export default async function WorkerDashboard() {
    const supabase = await createClient()

    // Mock worker profile & history
    const workerProfile = {
        name: 'S. Ramaswamy',
        id: 'W-DE-901',
        earnings: '₹ 4,850.00',
        hoursThisWeek: '38.5h'
    }

    const shiftHistory = [
        { date: '11 Jan 2026', checkIn: '08:02 AM', checkOut: '04:15 PM', hours: '8.2h', Status: 'Approved' },
        { date: '10 Jan 2026', checkIn: '07:58 AM', checkOut: '05:00 PM', hours: '9.0h', Status: 'Approved' },
        { date: '09 Jan 2026', checkIn: '08:10 AM', checkOut: '04:30 PM', hours: '8.3h', Status: 'Approved' },
        { date: '08 Jan 2026', checkIn: '08:05 AM', checkOut: '04:00 PM', hours: '7.9h', Status: 'Approved' },
    ]

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Worker Portal</h1>
                    <p className="text-gray-500 text-sm">Welcome back, {workerProfile.name}</p>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-green-200">
                    <Trophy className="h-5 w-5 text-green-700" />
                    <span className="text-green-800 font-bold text-sm">Top Performer</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Projected Earnings</div>
                            <div className="text-3xl font-bold text-gray-900">{workerProfile.earnings}</div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">Expected payout on 15th Jan 2026</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Worked This Week</div>
                            <div className="text-3xl font-bold text-gray-900">{workerProfile.hoursThisWeek}</div>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <History className="h-4 w-4 mr-2 text-gray-400" />
                        Recent Shifts
                    </h3>
                    <Calendar className="h-4 w-4 text-gray-300" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Check-in</th>
                                <th className="px-6 py-4">Check-out</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {shiftHistory.map((shift, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{shift.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{shift.checkIn}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{shift.checkOut}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{shift.hours}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-tight">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            {shift.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
