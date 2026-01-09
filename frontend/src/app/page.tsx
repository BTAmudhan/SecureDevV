'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CreditCard, ChevronRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen trust-bg text-foreground relative overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col">
            {/* Background Effects */}
            <div className="absolute inset-0 trust-grid pointer-events-none z-0" />

            {/* Header */}
            <header className="relative z-50 w-full max-w-[1440px] mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white">TrustLock</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                    {['Products', 'Solutions', 'Pricing', 'Resources'].map((item) => (
                        <button key={item} className="hover:text-white transition-colors">{item}</button>
                    ))}
                </nav>

                <Link href="/dashboard">
                    <Button className="rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all px-6">
                        Get Started
                    </Button>
                </Link>
            </header>

            {/* Hero Section */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 pb-20">

                {/* Floating Cards Graphic */}
                <div className="relative w-full max-w-5xl h-[400px] mb-12 flex items-center justify-center perspective-1000">
                    {/* Left Card: Password Defense */}
                    <div className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 w-[300px] h-[180px] trust-card rounded-2xl p-6 flex flex-col justify-center gap-4 transform -rotate-y-12 translate-z-[-50px] opacity-80 hover:opacity-100 hover:translate-z-0 transition-all duration-500 hidden md:flex">
                        <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                            <div className="w-24 h-2 bg-zinc-700 rounded-full animate-pulse"></div>
                            <Shield className="h-5 w-5 text-blue-500 ml-auto" />
                        </div>
                        <div className="mt-2 text-center text-sm text-zinc-500 font-medium">Password Leak Defense</div>
                    </div>

                    {/* Right Card: Login Security */}
                    <div className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 w-[300px] h-[180px] trust-card rounded-2xl p-6 flex flex-col justify-center items-center gap-6 transform rotate-y-12 translate-z-[-50px] opacity-80 hover:opacity-100 hover:translate-z-0 transition-all duration-500 hidden md:flex">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-3 h-3 rounded-full bg-zinc-700 border border-white/10"></div>
                            ))}
                        </div>
                        <div className="text-sm text-zinc-500 font-medium">Advanced Login Security</div>
                    </div>

                    {/* Center Card: Main Hero Card */}
                    <div className="relative z-20 w-[340px] h-[220px] bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col items-center justify-center p-8 transform hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>

                        <div className="flex items-center gap-6 mb-6 w-full justify-center">
                            <div className="h-12 w-8 rounded-md bg-gradient-to-br from-amber-200 to-yellow-500 flex items-center justify-center shadow-lg">
                                <div className="w-5 h-4 border-2 border-amber-600/50 rounded-sm"></div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10"></div>
                        </div>

                        {/* Data Stream Effect */}
                        <div className="w-full h-12 overflow-hidden relative">
                            <div className="absolute inset-0 flex flex-col gap-1 opacity-30">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="text-[8px] font-mono text-blue-400 whitespace-nowrap overflow-hidden">
                                        010100101010101001010101010101010101
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                        </div>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="text-center space-y-6 max-w-2xl mx-auto z-20">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg">
                        Trusted Data Protection
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide">
                        Maximum Data Safety, Minimum Effort
                    </p>
                    <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
                        Take control of your data stack—encrypt sensitive info, minimize risks, meet compliance, prevent vendor lock-in, and scale securely.
                    </p>

                    <div className="pt-8">
                        <Link href="/dashboard">
                            <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                                Try It Free
                            </Button>
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}
