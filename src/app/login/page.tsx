'use client'

import { createClient } from '@/lib/supabase/client'
import { Leaf, Chrome } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Login error:', error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-200">
                        <Leaf className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome to PlantationOS
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Secure access for Managers, Supervisors, and Workers
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mr-2" />
                            ) : (
                                <Chrome className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                                    Corporate Authentication
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-500 leading-relaxed">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                            Access is restricted to authorized plantation personnel.
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Device authorized? <span className="text-green-600 font-medium">RFID systems auto-syncing</span>
                </p>
            </div>
        </div>
    )
}
