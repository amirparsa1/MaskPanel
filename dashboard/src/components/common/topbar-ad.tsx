import { useTheme } from '@/app/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X, Shield, Zap, EyeOff, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

const TOPBAR_AD_STORAGE_KEY = 'maskpanel_flux_banner_closed'
const HOURS_TO_HIDE = 12

export default function TopbarAd() {
  const { resolvedTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const checkShouldShow = () => {
      const closedTimestamp = localStorage.getItem(TOPBAR_AD_STORAGE_KEY)
      if (!closedTimestamp) {
        setIsVisible(true)
        setTimeout(() => setIsAnimating(true), 100)
        return
      }
      const closedTime = parseInt(closedTimestamp, 10)
      const now = Date.now()
      const hoursSinceClose = (now - closedTime) / (1000 * 60 * 60)
      if (hoursSinceClose >= HOURS_TO_HIDE) {
        setIsVisible(true)
        setTimeout(() => setIsAnimating(true), 100)
      }
    }
    // Show after a short delay
    const t = setTimeout(checkShouldShow, 1500)
    return () => clearTimeout(t)
  }, [])

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsClosing(true)
    localStorage.setItem(TOPBAR_AD_STORAGE_KEY, Date.now().toString())
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className={cn(
        'relative z-[25] w-full border-b backdrop-blur-sm lg:z-30',
        'bg-gradient-to-r from-violet-600/15 via-cyan-500/10 to-violet-600/15 border-violet-500/20',
        isDark ? 'from-violet-600/20 via-cyan-500/15 to-violet-600/20' : '',
        'overflow-hidden',
        isClosing ? 'max-h-0 -translate-y-2 border-0 py-0 opacity-0' : 'max-h-32',
      )}
      style={{
        transition: isClosing
          ? 'max-height 300ms ease-in-out, opacity 300ms ease-in-out, transform 300ms ease-in-out'
          : 'opacity 400ms ease-out, transform 400ms ease-out',
        opacity: isClosing ? 0 : isAnimating ? 1 : 0,
        transform: isClosing ? 'translateY(-8px)' : isAnimating ? 'translateY(0)' : 'translateY(-8px)',
      }}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-4 text-xs sm:text-[13px]">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-medium">MaskPanel by RunoFlux</span>
            <span className="text-muted-foreground">•</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Flux:</span> Optimal
            </span>
            <span className="flex items-center gap-1">
              <EyeOff className="h-3 w-3 text-violet-500" />
              <span className="hidden sm:inline">Ghost:</span> 94%
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-cyan-500" />
              <span className="hidden sm:inline">Masks:</span> 12 active
            </span>
            <span className="hidden md:flex items-center gap-1 text-muted-foreground">
              ᛗ ᚱ ᚠ ᛚ ᚢ ᛉ
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Veiled Connectivity, Flux Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 px-2.5 py-1 text-[11px] font-medium text-white">
            <Zap className="h-3 w-3 mr-1" />
            VEILED FLUX
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        aria-label="Close banner"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
