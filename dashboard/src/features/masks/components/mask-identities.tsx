import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MaskPanelLogo } from '@/components/icons/maskpanel-logo'
import { Eye, EyeOff, Shuffle, Clock, Fingerprint, Zap, Copy, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MaskIdentity {
  id: string
  name: string
  rune: string
  status: 'active' | 'rotating' | 'ghost' | 'expired'
  fingerprint: string
  lastRotated: string
  obfuscation: number
  connections: number
}

const mockMasks: MaskIdentity[] = [
  { id: '1', name: 'Veil-Alpha', rune: 'ᛗ', status: 'active', fingerprint: 'a3f9::c1d2::e4b5', lastRotated: '2m ago', obfuscation: 94, connections: 12 },
  { id: '2', name: 'Flux-Beta', rune: 'ᚱ', status: 'ghost', fingerprint: '9a8b::7c6d::5e4f', lastRotated: '5m ago', obfuscation: 89, connections: 8 },
  { id: '3', name: 'Rune-Gamma', rune: 'ᚠ', status: 'rotating', fingerprint: 'f1e2::d3c4::b5a6', lastRotated: 'now', obfuscation: 97, connections: 23 },
  { id: '4', name: 'Shadow-Delta', rune: 'ᛉ', status: 'active', fingerprint: 'c7d8::e9f0::a1b2', lastRotated: '12m ago', obfuscation: 76, connections: 5 },
]

export function MaskIdentities({ className }: { className?: string }) {
  const getStatusConfig = (status: MaskIdentity['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: Eye, dot: 'bg-emerald-500' }
      case 'ghost':
        return { label: 'Ghost', className: 'bg-violet-500/10 text-violet-600 border-violet-500/20', icon: EyeOff, dot: 'bg-violet-500' }
      case 'rotating':
        return { label: 'Rotating', className: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20', icon: Shuffle, dot: 'bg-cyan-500' }
      case 'expired':
        return { label: 'Expired', className: 'bg-red-500/10 text-red-600 border-red-500/20', icon: Clock, dot: 'bg-red-500' }
    }
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-mono text-sm">
              ᛗ
            </div>
            Mask Identities
            <Badge variant="secondary" className="ml-2 font-mono text-xs">{mockMasks.length} ACTIVE</Badge>
          </CardTitle>
          <Button size="sm" className="h-8 gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 border-0">
            <Zap className="h-3.5 w-3.5" />
            New Mask
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {mockMasks.map((mask) => {
            const status = getStatusConfig(mask.status)
            const StatusIcon = status.icon
            return (
              <div
                key={mask.id}
                className="group relative rounded-xl border bg-gradient-to-br from-card to-card/50 p-3 hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border flex items-center justify-center font-mono text-lg">
                        {mask.rune}
                      </div>
                      <div className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background', status.dot)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{mask.name}</p>
                        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4', status.className)}>
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                          <Fingerprint className="h-3 w-3" />
                          {mask.fingerprint}
                        </span>
                        <Button variant="ghost" size="icon" className="h-4 w-4">
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {mask.lastRotated}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                          style={{ width: `${mask.obfuscation}%` }}
                        />
                      </div>
                      {mask.obfuscation}%
                    </span>
                    <span className="text-muted-foreground">{mask.connections} conns</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2">
                      <Shuffle className="h-3 w-3 mr-1" />
                      Rotate
                    </Button>
                  </div>
                </div>

                {/* Flux line decoration */}
                <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>

        <div className="rounded-lg bg-muted/50 p-3 border border-dashed">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MaskPanelLogo size={14} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Masked Identity System</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Each mask is an ephemeral identity with rotating fingerprints, ghost routing, and adaptive flux balancing.
                Masks automatically rotate every 15 minutes or on-demand. <span className="font-mono text-violet-600">ᛗ VEILED ᛉ</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function GhostModeToggle({ enabled = true, onToggle }: { enabled?: boolean; onToggle?: (v: boolean) => void }) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 to-cyan-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Ghost Mode</p>
              <p className="text-xs text-white/70">Stealth routing & fingerprint randomization</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-white/20 hover:bg-white/20">
              {enabled ? 'ACTIVE' : 'OFF'}
            </Badge>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 bg-white text-violet-700 hover:bg-white/90"
              onClick={() => onToggle?.(!enabled)}
            >
              {enabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
        {enabled && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-lg bg-white/10 backdrop-blur p-2">
              <p className="text-white/60">Obfuscation</p>
              <p className="font-mono font-bold">94%</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur p-2">
              <p className="text-white/60">Rotation</p>
              <p className="font-mono font-bold">15m</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur p-2">
              <p className="text-white/60">Flux Nodes</p>
              <p className="font-mono font-bold">12 active</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
