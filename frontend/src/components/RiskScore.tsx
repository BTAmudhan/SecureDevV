import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressCircle } from "@tremor/react"
import { ShieldAlert } from "lucide-react"

interface RiskScoreProps {
    score: number
    status: string
}

export function RiskScore({ score, status }: RiskScoreProps) {
    const color = score > 80 ? "rose" : score > 50 ? "amber" : "emerald"

    return (
        <Card className="trust-card border-0 relative overflow-hidden group">
            {/* Ambient Trace */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 group-hover:opacity-50 transition-opacity"></div>

            <CardHeader className="pb-8 pt-8">
                <CardTitle className="flex justify-between items-start">
                    <span className="text-sm font-medium text-zinc-400">Composite Risk Analysis</span>
                    <ShieldAlert className="h-5 w-5 text-blue-500 opacity-80" />
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center pb-10">
                <ProgressCircle
                    value={score}
                    size="xl"
                    radius={70}
                    strokeWidth={8}
                    color={color}
                    showAnimation={true}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-5xl font-light text-white tracking-tighter">{score}</span>
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">Score</span>
                    </div>
                </ProgressCircle>

                <div className="mt-8 text-center w-full px-6">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                        <span className="text-zinc-500">Identity Risk</span>
                        <span className="text-zinc-300">Analysis Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                        <span className="text-zinc-500">Code Integrity</span>
                        <span className="text-zinc-300">Scanning...</span>
                    </div>

                    <div className={`mt-6 text-sm font-semibold tracking-wide py-2 px-4 rounded-lg border ${status === 'CRITICAL_SYSTEM_LOCK'
                            ? 'text-red-300 border-red-500/20 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : status === 'HIGH_RISK'
                                ? 'text-amber-300 border-amber-500/20 bg-amber-500/10'
                                : 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10'
                        }`}>
                        {status.replace(/_/g, " ")}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
