import Link from 'next/link'
import { ArrowRight, BarChart3, Clock, Cpu, ShieldCheck, Smartphone, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6 border border-green-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Production Ready IoT Integration</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
                The Digital Workforce for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Modern Plantations
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                Streamline labour management with RFID-integrated attendance, real-time analytics, and automated payroll. Built for scale, security, and precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold text-lg shadow-xl shadow-green-100 flex items-center justify-center group"
                >
                  Start Management
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#demo"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl hover:border-green-200 hover:bg-green-50/30 transition-all font-semibold text-lg"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Integrated Management Suite</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need to digitize your plantation workforce operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Integration Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-900 rounded-[2.5rem] p-8 lg:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-800 rounded-full blur-3xl opacity-50" />

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">IoT-Powered Attendance</h2>
                  <p className="text-green-100 text-lg mb-8 leading-relaxed">
                    Our platform integrates seamlessly with ESP32-based RFID readers. Eliminate manual entry errors and proxy attendance with instantaneous data syncing.
                  </p>
                  <ul className="space-y-4">
                    {iotFeatures.map((f, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <ShieldCheck className="h-6 w-6 text-green-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-video bg-green-800/50 rounded-2xl border border-green-700 flex items-center justify-center shadow-2xl">
                  <div className="text-center scale-110">
                    <Cpu className="h-20 w-20 text-green-400 mx-auto mb-4 animate-pulse" />
                    <div className="text-green-400 font-mono text-sm tracking-widest uppercase">ESP32: Connected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2026 PlantationOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'RFID Attendance',
    description: 'Instant worker check-in/out with secure RFID cards and smart IoT devices.',
    icon: <Clock className="h-6 w-6" />
  },
  {
    title: 'Workforce Analytics',
    description: 'Real-time dashboards for managers to track productivity and attendance trends.',
    icon: <BarChart3 className="h-6 w-6" />
  },
  {
    title: 'Role-Based Access',
    description: 'Secure partitions for Managers, Supervisors, and Workers with Supabase RLS.',
    icon: <Users className="h-6 w-6" />
  },
  {
    title: 'Automated Payroll',
    description: 'Calculate daily/weekly/monthly wages automatically based on shift logic.',
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: 'Mobile First',
    description: 'Optimized for field supervisors and workers on any mobile or tablet device.',
    icon: <Smartphone className="h-6 w-6" />
  },
  {
    title: 'Customized Zoning',
    description: 'Manage complex plantation structures with zones, blocks, and assigned supervisors.',
    icon: <Cpu className="h-6 w-6" />
  }
]

const iotFeatures = [
  "End-to-end encrypted hardware communication",
  "Hardware-level duplicate tap prevention",
  "Offline data caching for spotty connectivity",
  "Real-time device health monitoring"
]
