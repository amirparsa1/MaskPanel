import { BRAND_NAME, FULL_BRAND, REPO_URL, TAGLINE } from '@/constants/Project'
import { FC } from 'react'
import { MaskPanelLogo } from '@/components/icons/maskpanel-logo'

const FooterContent = () => {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex items-center gap-2 text-xs">
        <MaskPanelLogo size={16} />
        <span className="text-muted-foreground">
          Crafted with{' '}
          <span className="flux-text font-semibold">ᛗ Flux</span> by{' '}
          <a className="text-primary hover:underline font-medium" href={REPO_URL} target="_blank">
            {FULL_BRAND}
          </a>
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
        <span>ᛗ MASK</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span>ᚱ FLUX</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span>ᛉ VEILED</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span>{TAGLINE}</span>
      </div>
    </div>
  )
}

export const Footer: FC = ({ ...props }) => {
  return (
    <div className="relative flex w-full flex-col items-center pt-2 pb-4 gap-2" {...props}>
      <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <FooterContent />
    </div>
  )
}
