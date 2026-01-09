import * as React from "react"
import { Card, CardContent, CardTitle, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code, AlertTriangle, CheckCircle, Shield } from "lucide-react"
import axios from "axios"

export function CodeAuditor() {
    const [code, setCode] = React.useState("")
    const [result, setResult] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false)

    const handleAnalyze = async () => {
        setLoading(true)
        try {
            const response = await axios.post("http://localhost:8000/api/auditor/analyze", { code })
            setResult(response.data)
        } catch (error) {
            console.error("Analysis failed", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="trust-card border-0 flex flex-col h-full">
            <CardHeader className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                            <Code className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-medium text-white">Code Auditor</CardTitle>
                        </div>
                    </div>

                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/5 font-normal tracking-wide">
                        GPT-4o Engine
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <Textarea
                        placeholder="// Paste code snippet to analyze security posture..."
                        className="relative font-mono h-52 bg-[#0A0E17] border-white/10 text-zinc-300 resize-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 p-5 text-sm leading-relaxed rounded-xl shadow-inner scrollbar-hide"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                {result && (
                    <div className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-500 ${result.vulnerability_score > 50
                            ? 'border-red-500/20 bg-red-500/[0.02]'
                            : 'border-emerald-500/20 bg-emerald-500/[0.02]'
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {result.vulnerability_score > 50
                                    ? <Shield className="h-4 w-4 text-red-400" />
                                    : <Shield className="h-4 w-4 text-emerald-400" />
                                }
                                <h4 className="font-medium text-sm text-zinc-200">Analysis Report</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500 uppercase tracking-wide">Risk Score</span>
                                <span className={`text-xl font-bold ${result.vulnerability_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {result.vulnerability_score}
                                </span>
                            </div>
                        </div>

                        {result.owasp_top_10.length > 0 ? (
                            <ul className="space-y-2 mb-4">
                                {result.owasp_top_10.map((v: string) => (
                                    <li key={v} className="flex items-start gap-2 text-sm text-red-300 bg-red-500/5 p-2 rounded border border-red-500/10">
                                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>{v}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/10 text-sm text-emerald-300 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Code passed all security checks.
                            </div>
                        )}

                        {result.secure_rewrite_suggestion && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <strong className="text-zinc-500 text-xs uppercase tracking-wide">Suggested Rewrite</strong>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-zinc-400 hover:text-white">Copy Code</Button>
                                </div>
                                <div className="p-4 bg-[#0A0E17] rounded-lg border border-white/5 overflow-x-auto relative group-code">
                                    <div className="absolute top-2 right-2 flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                                    </div>
                                    <code className="text-purple-300 text-xs font-mono block mt-2">
                                        {result.secure_rewrite_suggestion}
                                    </code>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <Button
                    className="w-full text-sm font-medium h-11 bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl"
                    onClick={handleAnalyze}
                    disabled={loading || !code}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-zinc-400 border-t-black rounded-full animate-spin"></span>
                            Running Analysis...
                        </span>
                    ) : "Run Security Scan"}
                </Button>
            </CardFooter>
        </Card>
    )
}
