import { cn } from '@/lib/utils'

interface MaskPanelLogoProps {
  size?: number
  className?: string
  variant?: 'full' | 'icon' | 'rune'
  animated?: boolean
}

export function MaskPanelLogo({ size = 32, className, variant = 'icon', animated = false }: MaskPanelLogoProps) {
  return (
    <div className={cn('relative flex items-center justify-center', animated && 'animate-flux-pulse', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Outer flux ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#fluxGradient)"
          strokeWidth="1.5"
          strokeDasharray="8 4"
          opacity="0.6"
          className={animated ? 'animate-spin' : ''}
          style={{ transformOrigin: '50% 50%', animationDuration: '20s' }}
        />
        
        {/* Mask base - stylized */}
        <path
          d="M50 18 C28 18 18 35 18 50 C18 68 28 85 50 85 C72 85 82 68 82 50 C82 35 72 18 50 18 Z"
          fill="url(#maskGradient)"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          opacity="0.95"
        />
        
        {/* Rune Mannaz ᛗ inside mask - represents humanity/connection */}
        <g transform="translate(50, 52)">
          {/* Vertical spine */}
          <line x1="0" y1="-18" x2="0" y2="18" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" />
          {/* Upper diagonals */}
          <line x1="0" y1="-18" x2="-10" y2="-6" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="-18" x2="10" y2="-6" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lower diagonals */}
          <line x1="0" y1="18" x2="-10" y2="6" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="18" x2="10" y2="6" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Eyes - masked / veiled */}
        <ellipse cx="34" cy="42" rx="8" ry="5" fill="hsl(var(--background))" opacity="0.9" />
        <ellipse cx="66" cy="42" rx="8" ry="5" fill="hsl(var(--background))" opacity="0.9" />
        
        {/* Flux dots - representing network nodes */}
        <circle cx="50" cy="12" r="2.5" fill="hsl(var(--flux-cyan))" className={animated ? 'animate-pulse' : ''} />
        <circle cx="85" cy="50" r="2" fill="hsl(var(--flux-violet))" opacity="0.8" />
        <circle cx="15" cy="50" r="2" fill="hsl(var(--flux-cyan))" opacity="0.8" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="fluxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--flux-violet))" />
            <stop offset="100%" stopColor="hsl(var(--flux-cyan))" />
          </linearGradient>
          <linearGradient id="maskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--flux-violet) / 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-xl" />
    </div>
  )
}

export function MaskPanelWordmark({ className, size = 'default' }: { className?: string; size?: 'small' | 'default' | 'large' }) {
  const sizeClasses = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-2xl'
  }
  
  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-baseline gap-1.5 font-bold tracking-tight', sizeClasses[size])}>
        <span className="flux-text">Mask</span>
        <span className="text-foreground">Panel</span>
        <span className="text-[0.6em] font-normal text-muted-foreground ml-1">by</span>
        <span className="text-[0.7em] font-semibold text-foreground/80">RunoFlux</span>
      </div>
      {size !== 'small' && (
        <span className="text-[0.65em] tracking-[0.2em] text-muted-foreground uppercase -mt-1">Veiled Flux</span>
      )}
    </div>
  )
}

export function RuneDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <span className="text-xs font-mono text-muted-foreground tracking-widest">ᛗ ᚱ ᚠ ᛚ ᚢ ᛉ</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
