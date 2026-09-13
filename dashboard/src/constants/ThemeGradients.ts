import type { ColorTheme } from '@/constants/color-themes'

export type GradientVariant = 'ad' | 'banner' | 'flux' | 'mask' | 'ghost'

/**
 * RunoFlux MaskPanel Gradients - Veiled Flux Engine
 * Unique gradient system with violet->cyan flux, obsidian depth, and mask glow
 */
export function getGradientByColorTheme(colorTheme: ColorTheme, isDark: boolean, variant: GradientVariant = 'ad'): string {
  // Flux variant - signature RunoFlux gradient
  if (variant === 'flux') {
    return isDark 
      ? 'bg-gradient-to-br from-violet-600/20 via-violet-500/10 to-cyan-500/20 border-violet-500/30 mask-glow' 
      : 'bg-gradient-to-br from-violet-500/15 via-violet-400/10 to-cyan-500/15 border-violet-500/20'
  }
  
  // Mask variant - obsidian with veil
  if (variant === 'mask') {
    return isDark
      ? 'bg-gradient-to-br from-zinc-800/50 via-zinc-900/30 to-zinc-800/20 border-zinc-700/50'
      : 'bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 border-zinc-200'
  }
  
  // Ghost variant - translucent veiled
  if (variant === 'ghost') {
    return isDark
      ? 'bg-gradient-to-r from-violet-600/10 via-transparent to-cyan-600/10 border-dashed border-violet-500/20'
      : 'bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 border-dashed border-violet-500/20'
  }

  if (variant === 'banner') {
    // Enhanced banner with flux accent
    if (colorTheme === 'flux' || colorTheme === 'violet') {
      return isDark 
        ? 'bg-gradient-to-r from-violet-600/20 via-cyan-500/10 to-violet-600/20 border-violet-500/30' 
        : 'bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-violet-500/10 border-violet-500/20'
    }
    return isDark ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/30' : 'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/30'
  }

  // Default with flux enhancement for MaskPanel themes
  if (colorTheme === 'flux' || colorTheme === 'mask' || colorTheme === 'rune') {
    return isDark 
      ? 'bg-gradient-to-r from-violet-600/15 via-cyan-500/10 to-violet-600/15' 
      : 'bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-violet-500/10'
  }

  return isDark ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20' : 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15'
}

export function getIndicatorColorByTheme(colorTheme: ColorTheme, _isDark: boolean): string {
  if (colorTheme === 'flux' || colorTheme === 'violet') return 'bg-gradient-to-r from-violet-500 to-cyan-500'
  if (colorTheme === 'mask') return 'bg-zinc-700'
  if (colorTheme === 'rune') return 'bg-amber-500'
  if (colorTheme === 'cyan') return 'bg-cyan-500'
  return 'bg-primary'
}

export function getFluxGradient(isDark: boolean): string {
  return isDark
    ? 'bg-gradient-to-br from-violet-600 to-cyan-600'
    : 'bg-gradient-to-br from-violet-500 to-cyan-500'
}

export function getMaskGradient(isDark: boolean): string {
  return isDark
    ? 'bg-gradient-to-br from-zinc-800 to-zinc-900'
    : 'bg-gradient-to-br from-zinc-50 to-zinc-100'
}
