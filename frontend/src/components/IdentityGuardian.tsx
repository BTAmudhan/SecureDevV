import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import axios from "axios"

export function IdentityGuardian() {
    const [sessions, setSessions] = React.useState<any[]>([])

    React.useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/identity/sessions")
                setSessions(res.data)
            } catch (e) { }
        }
        fetchSessions()
        const interval = setInterval(fetchSessions, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Card className="trust-card border-0">
            <CardHeader className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-medium text-white mb-1">Identity Guardian</CardTitle>
                        <CardDescription className="text-xs text-zinc-400">Entra ID Session Telemetry</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            Active Monitoring
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.02] text-zinc-500 border-b border-white/5">
                            <tr>
                                <th className="py-3 px-6 font-medium text-[11px] uppercase tracking-wider">User Principal</th>
                                <th className="py-3 px-6 font-medium text-[11px] uppercase tracking-wider">Location</th>
                                <th className="py-3 px-6 font-medium text-[11px] uppercase tracking-wider">Session Risk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sessions.map((s) => (
                                <tr key={s.id} className="group hover:bg-blue-500/[0.03] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                                                {s.user.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-zinc-200 group-hover:text-blue-300 transition-colors">{s.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-zinc-400 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                            {s.location}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${s.risk_level === 'Safe'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : s.risk_level === 'Impossible Travel'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-sm'
                                            }`}>
                                            {s.risk_level}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
