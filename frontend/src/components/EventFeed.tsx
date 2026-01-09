import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Lock, ShieldCheck, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

export function EventFeed() {
    const [events, setEvents] = React.useState<any[]>([])

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/events")
                setEvents(res.data)
            } catch (e) { }
        }
        fetchEvents()
        const interval = setInterval(fetchEvents, 10000)
        return () => clearInterval(interval)
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'critical': return <Lock className="h-4 w-4 text-red-500" />
            case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />
            case 'success': return <ShieldCheck className="h-4 w-4 text-emerald-500" />
            default: return <Zap className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <Card className="trust-card border-0 h-[420px] flex flex-col">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <CardTitle className="text-sm font-medium text-zinc-200">Live Activity</CardTitle>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Processed 24ms ago</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-0 p-0 overflow-y-auto flex-1 custom-scrollbar">
                {events.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group">
                        {/* Status Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${event.type === 'critical' ? 'bg-red-500' : event.type === 'warning' ? 'bg-amber-500' : 'bg-transparent'
                            }`}></div>

                        <div className="mt-1 opacity-80">{getIcon(event.type)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-semibold tracking-wide uppercase ${event.type === 'critical' ? 'text-red-300' : 'text-zinc-300'
                                    }`}>
                                    {event.type}
                                </span>
                                <span className="text-[10px] text-zinc-600 font-medium">{event.timestamp}</span>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:z-10 bg-inherit w-full">
                                {event.message}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
