import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, Zap, Shield, EyeOff, Cpu, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FluxMetric {
  label: string
  value: number
  max: number
  status: 'optimal' | 'stable' | 'flux' | 'critical'
  icon: React.ReactNode
  rune: string
}

export function FluxMeter({ className }: { className?: string }) {
  const metrics: FluxMetric[] = [
    { label: 'Flux Balance', value: 87, max: 100, status: 'optimal', icon: <Activity className="h-4 w-4" />, rune: 'ᛗ' },
    { label: 'Veil Integrity', value: 94, max: 100, status: 'optimal', icon: <Shield className="h-4 w-4" />, rune: 'ᛉ' },
    { label: 'Ghost Routing', value: 76, max: 100, status: 'stable', icon: <EyeOff className="h-4 w-4" />, rune: 'ᛚ' },
    { label: 'Node Flux', value: 68, max: 100, status: 'flux', icon: <Globe className="h-4 w-4" />, rune: 'ᚱ' },
    { label: 'Obfuscation', value: 91, max: 100, status: 'optimal', icon: <Zap className="h-4 w-4" />, rune: 'ᚠ' },
    { label: 'Mask Health', value: 82, max: 100, status: 'stable', icon: <Cpu className="h-4 w-4" />, rune: 'ᚢ' },
  ]

  const getStatusColor = (status: FluxMetric['status']) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-500'
      case 'stable': return 'bg-cyan-500'
      case 'flux': return 'bg-amber-500'
      case 'critical': return 'bg-red-500'
    }
  }

  const getStatusBadge = (status: FluxMetric['status']) => {
    const variants: Record<string, { label: string; className: string }> = {
      optimal: { label: 'Optimal', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      stable: { label: 'Stable', className: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
      flux: { label: 'Fluxing', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      critical: { label: 'Critical', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
    }
    return variants[status]
  }

  const overallFlux = Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)

  return (
    <Card className={cn('overflow-hidden border flux-border', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            Flux Intelligence
            <Badge variant="outline" className="ml-2 font-mono text-[10px]">ᚱᚢᚾᛟ ᚠᛚᚢᛉ</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Overall</span>
            <span className="text-lg font-bold flux-text">{overallFlux}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flux visualization */}
        <div className="relative h-20 rounded-lg bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 border overflow-hidden rune-pattern">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-violet-500 to-cyan-500 rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.sin(i * 0.8 + Date.now() * 0.001) * 15 + Math.random() * 10}px`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>ᛗ MASKED</span>
            <span>ᚠ FLUX ACTIVE</span>
            <span>ᛉ VEILED</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const badge = getStatusBadge(metric.status)
            return (
              <div key={metric.label} className="group relative rounded-lg border bg-card/50 p-3 hover:bg-card transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{metric.label}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{metric.rune} RUNE</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', badge.className)}>
                    {badge.label}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{metric.value}%</span>
                    <span className="font-mono text-[10px]">{metric.value}/{metric.max}</span>
                  </div>
                  <div className="relative">
                    <Progress value={metric.value} className="h-1.5" />
                    <div
                      className={cn('absolute top-0 h-1.5 rounded-full blur-[2px] opacity-60 transition-all', getStatusColor(metric.status))}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Flux Engine: Active
          </span>
          <span className="font-mono">ᛗᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ObfuscationScore({ score = 94, className }: { score?: number; className?: string }) {
  const getScoreLabel = (s: number) => {
    if (s >= 90) return { label: 'Ghost', color: 'text-emerald-500', bg: 'bg-emerald-500' }
    if (s >= 75) return { label: 'Veiled', color: 'text-cyan-500', bg: 'bg-cyan-500' }
    if (s >= 60) return { label: 'Masked', color: 'text-amber-500', bg: 'bg-amber-500' }
    return { label: 'Exposed', color: 'text-red-500', bg: 'bg-red-500' }
  }

  const level = getScoreLabel(score)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Obfuscation Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
              <Badge className={cn('ml-2', level.bg, 'text-white border-0')}>{level.label}</Badge>
            </div>
          </div>
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="url(#obfGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${score * 1.13} 113`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="obfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--flux-violet))" />
                  <stop offset="100%" stopColor="hsl(var(--flux-cyan))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className={cn('h-6 w-6', level.color)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
