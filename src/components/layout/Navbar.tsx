'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X, Leaf, LogOut, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Leaf className="h-8 w-8 text-green-600" />
                            <span className="font-bold text-xl text-green-900 tracking-tight">PlantationOS</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</Link>
                        <Link href="#solutions" className="text-gray-600 hover:text-green-600 transition-colors">Solutions</Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg shadow-green-100"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute w-full bg-white border-b border-green-100 transition-all duration-300 ease-in-out",
                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="#features" className="block px-3 py-2 text-gray-600">Features</Link>
                    <Link href="#solutions" className="block px-3 py-2 text-gray-600">Solutions</Link>
                    {user ? (
                        <>
                            <Link href="/dashboard" className="block px-3 py-2 text-green-600 font-medium">Dashboard</Link>
                            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500 font-medium">Logout</button>
                        </>
                    ) : (
                        <Link href="/login" className="block px-3 py-2 bg-green-600 text-white rounded-md mx-3 mt-4 text-center">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
