import { X, Shield, Zap, EyeOff } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getAuthToken } from '@/utils/authStorage'
import { MaskPanelLogo } from '@/components/icons/maskpanel-logo'
import { BRAND_NAME, FULL_BRAND } from '@/constants/Project'

const DONATION_STORAGE_KEY = 'maskpanel_welcome_v1'
const FIRST_SHOW_DELAY = 3 * 60 * 1000 // 3 minutes
const SECRET_SALT = 'maskpanel_runoflux_v1'
const MAX_TIMEOUT_MS = 2_147_483_647
const MODAL_BUSY_RETRY_MS = 2000

const isAnotherModalOpen = (): boolean => document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]') !== null

interface DonationData {
  lastShown: string | null
  nextShowTime: string
  showCount: number
  checksum: string
}

const getDelayDays = (showCount: number): number => {
  switch (showCount) {
    case 0: return 7
    case 1: return 14
    default: return 30
  }
}

const generateChecksum = (lastShown: string | null, nextShowTime: string, showCount: number): string => {
  const data = `${lastShown || 'null'}_${nextShowTime}_${showCount}_${SECRET_SALT}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

const validateData = (data: DonationData): boolean => {
  const expectedChecksum = generateChecksum(data.lastShown, data.nextShowTime, data.showCount ?? 0)
  if (data.checksum !== expectedChecksum) return false
  if (typeof data.showCount !== 'number' || data.showCount < 0 || !Number.isInteger(data.showCount)) return false
  const nextShowTimestamp = new Date(data.nextShowTime).getTime()
  if (isNaN(nextShowTimestamp)) return false
  return true
}

const setStorageData = (data: Omit<DonationData, 'checksum'>) => {
  const checksum = generateChecksum(data.lastShown, data.nextShowTime, data.showCount ?? 0)
  const fullData: DonationData = { ...data, checksum }
  localStorage.setItem(DONATION_STORAGE_KEY, JSON.stringify(fullData))
}

const getStorageData = (): DonationData | null => {
  const stored = localStorage.getItem(DONATION_STORAGE_KEY)
  if (!stored) return null
  try {
    const data = JSON.parse(stored) as Partial<DonationData>
    const fullData: DonationData = { ...data, showCount: data.showCount ?? 0 } as DonationData
    if (!validateData(fullData)) {
      localStorage.removeItem(DONATION_STORAGE_KEY)
      return null
    }
    return fullData
  } catch {
    return null
  }
}

export default function DonationPopup() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutIdsRef = useRef<number[]>([])
  const hasShownRef = useRef(false)

  const clearScheduledTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
    timeoutIdsRef.current = []
  }, [])

  const schedulePopup = useCallback((delayMs: number, callback: () => void) => {
    const scheduleChunk = (remainingMs: number) => {
      const nextDelay = Math.min(remainingMs, MAX_TIMEOUT_MS)
      const timeoutId = window.setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter(id => id !== timeoutId)
        if (remainingMs > MAX_TIMEOUT_MS) {
          scheduleChunk(remainingMs - MAX_TIMEOUT_MS)
          return
        }
        callback()
      }, nextDelay)
      timeoutIdsRef.current.push(timeoutId)
    }
    if (delayMs <= 0) { callback(); return }
    scheduleChunk(delayMs)
  }, [])

  const showPopup = useCallback(() => {
    if (hasShownRef.current) return
    if (isAnotherModalOpen()) {
      const timeoutId = window.setTimeout(() => showPopup(), MODAL_BUSY_RETRY_MS)
      timeoutIdsRef.current.push(timeoutId)
      return
    }
    hasShownRef.current = true
    const now = Date.now()
    const data = getStorageData()
    const currentShowCount = data?.showCount ?? 0
    const delayDays = getDelayDays(currentShowCount)
    const nextShowTime = new Date(now + delayDays * 24 * 60 * 60 * 1000).toISOString()
    setStorageData({ lastShown: new Date(now).toISOString(), nextShowTime, showCount: currentShowCount + 1 })
    setIsVisible(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)))
  }, [])

  useEffect(() => {
    clearScheduledTimeouts()
    if (!getAuthToken()) {
      hasShownRef.current = false
      setIsVisible(false)
      setIsAnimating(false)
      return
    }
    const checkShouldShow = () => {
      const data = getStorageData()
      const now = Date.now()
      if (!data) {
        const nextShowTime = new Date(now + FIRST_SHOW_DELAY).toISOString()
        setStorageData({ lastShown: null, nextShowTime, showCount: 0 })
        schedulePopup(FIRST_SHOW_DELAY, showPopup)
        return
      }
      const nextShowTimestamp = new Date(data.nextShowTime).getTime()
      const timeUntilShow = nextShowTimestamp - now
      if (timeUntilShow <= 0) showPopup()
      else schedulePopup(timeUntilShow, showPopup)
    }
    checkShouldShow()
    return () => clearScheduledTimeouts()
  }, [clearScheduledTimeouts, schedulePopup, showPopup])

  if (!getAuthToken()) return null

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 500)
  }

  const handleExplore = () => {
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className={cn('pointer-events-auto absolute inset-0 bg-black/60 backdrop-blur-sm', 'transition-opacity duration-700', isAnimating ? 'opacity-100' : 'opacity-0')} onClick={handleClose} />
      <div className={cn('pointer-events-auto relative w-full max-w-md', 'transform transition-all duration-700 ease-out', isAnimating ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-8 scale-95 opacity-0')}>
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-card via-card to-violet-500/[0.03] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          
          <button onClick={handleClose} className="absolute top-4 right-4 z-10 rounded-full bg-muted/80 hover:bg-muted p-2 transition-all hover:scale-110" aria-label="Close">
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 blur-xl opacity-30" />
                <div className="relative rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 p-[1px]">
                  <div className="rounded-full bg-card p-4">
                    <MaskPanelLogo size={48} animated />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-center text-2xl font-bold tracking-tight mb-1">
              <span className="flux-text">MaskPanel</span> by RunoFlux
            </h3>
            <p className="text-center text-[11px] tracking-[0.2em] text-muted-foreground uppercase mb-4">Veiled Flux • ᚱᚢᚾᛟ ᚠᛚᚢᛉ</p>

            <div className="rounded-xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border border-violet-500/10 p-4 mb-6">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-500" />
                Welcome to Veiled Connectivity
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <span><strong className="text-foreground">Masked Identities</strong> - Ephemeral rotating fingerprints with rune tags ᛗ ᚱ ᚠ</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-3.5 w-3.5 mt-0.5 text-violet-500 flex-shrink-0" />
                  <span><strong className="text-foreground">Flux Intelligence</strong> - Adaptive routing with 6D health metrics & obfuscation scoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <EyeOff className="h-3.5 w-3.5 mt-0.5 text-cyan-500 flex-shrink-0" />
                  <span><strong className="text-foreground">Ghost Mode</strong> - Stealth operation with 94% obfuscation & veil integrity</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleExplore} size="lg" className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Zap className="mr-2 h-5 w-5" />
                Explore Flux Engine
              </Button>
              <div className="text-center">
                <p className="text-[11px] font-mono text-muted-foreground">ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • ᛉ ᚡᛖᛁᛚᛖᛞ ᚠᛚᚢᛉ</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Veiled Connectivity, Flux Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
