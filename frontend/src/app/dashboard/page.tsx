'use client';

import React from 'react'
import axios from 'axios'
import { ProgressCircle } from '@tremor/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Shield, ShieldAlert, Zap, Lock, Activity, Terminal, AlertTriangle, CheckCircle, Code, Users } from "lucide-react"

import { RiskScore } from '@/components/RiskScore'
import { EventFeed } from '@/components/EventFeed'
import { CodeAuditor } from '@/components/CodeAuditor'
import { IdentityGuardian } from '@/components/IdentityGuardian'

export default function Dashboard() {
    const [stats, setStats] = React.useState<any>(null)

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/dashboard/stats")
                setStats(res.data)
            } catch (e) {
                console.error("Backend not reachable?")
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen trust-bg text-foreground relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 trust-grid pointer-events-none z-0" />

            <div className="relative z-10 p-8 max-w-[1440px] mx-auto">
                {/* Header */}
                <header className="mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40"></div>
                                <Shield className="relative h-10 w-10 text-blue-400" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    TrustLock<span className="font-light text-zinc-400">.ai</span>
                                </h1>
                                <p className="text-xs text-blue-300/80 font-medium tracking-wide uppercase">
                                    Zero Trust Intelligence Platform
                                </p>
                            </div>
                        </div>

                        {/* Navigation Pills */}
                        <div className="hidden md:flex ml-8 pl-8 border-l border-white/10 gap-1">
                            {['Dashboard', 'Incidents', 'Policies', 'Settings'].map((item, i) => (
                                <button key={item} className={`px-4 py-1.5 text-sm rounded-full transition-all ${i === 0
                                    ? 'bg-white/10 text-white font-medium border border-white/10 shadow-sm'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status Pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-emerald-400 tracking-wide">SYSTEM OPERATIONAL</span>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right">
                                <div className="text-xs font-medium text-white">Admin User</div>
                                <div className="text-[10px] text-zinc-500">Security Ops</div>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                AU
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Column: Risk & Events */}
                    <div className="space-y-8 lg:col-span-1">
                        <RiskScore
                            score={stats?.global_risk?.global_risk_score || 0}
                            status={stats?.global_risk?.status || "CALCULATING..."}
                        />
                        <EventFeed />
                    </div>

                    {/* Center/Right: Operations */}
                    <div className="lg:col-span-3 space-y-8">
                        <IdentityGuardian />
                        <CodeAuditor />
                    </div>

                </div>
            </div>
        </div>
    )
}
