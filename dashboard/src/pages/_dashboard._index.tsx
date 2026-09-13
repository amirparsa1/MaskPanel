import AdminStatisticsCard from '@/features/dashboard/components/admin-statistics-card'
import DashboardStatistics from '@/features/dashboard/components/dashboard-statistics'
import WorkersHealthCard from '@/features/dashboard/components/workers-health-card'
import AdminFilterCombobox from '@/components/common/admin-filter-combobox'
import { useCommandPaletteStore } from '@/hooks/use-command-palette-store'
import UserModal from '@/features/users/dialogs/user-modal'
import { Separator } from '@/components/ui/separator'
import { useAdmin } from '@/hooks/use-admin'
import { useClipboard } from '@/hooks/use-clipboard'
import type { AdminDetails, UserResponse } from '@/service/api'
import { useGetSystemResourceStats, useGetSystemUsersStats } from '@/service/api'
import { Bookmark, Sparkles, Shield, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PageHeader from '@/components/layout/page-header'
import { type UseEditFormValues, type UseFormValues, getDefaultUserForm } from '@/features/users/forms/user-form'
import { hasPermission, hasScopeAll } from '@/utils/rbac'
import { useQueryClient } from '@tanstack/react-query'
import { FluxMeter, ObfuscationScore } from '@/features/flux/components/flux-meter'
import { MaskIdentities, GhostModeToggle } from '@/features/masks/components/mask-identities'
import { MaskPanelLogo, RuneDivider } from '@/components/icons/maskpanel-logo'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type DashboardAdmin = Pick<AdminDetails, 'id' | 'username'>

const totalAdmin: DashboardAdmin = {
  username: 'Total',
}

const Dashboard = () => {
  const [isUserModalOpen, setUserModalOpen] = useState(false)
  const [ghostEnabled, setGhostEnabled] = useState(true)
  const setCommandPaletteOpen = useCommandPaletteStore(s => s.setOpen)
  const { admin: currentAdmin } = useAdmin()
  const canReadAllUsers = hasScopeAll(currentAdmin, 'users', 'read')
  const canCreateUsers = hasPermission(currentAdmin, 'users', 'create')
  const canReadNodeStats = hasPermission(currentAdmin, 'nodes', 'stats')
  const { t } = useTranslation()

  const [selectedAdmin, setSelectedAdmin] = useState<DashboardAdmin | undefined>(totalAdmin)

  const userForm = useForm<UseFormValues | UseEditFormValues>({
    defaultValues: getDefaultUserForm,
  })

  const queryClient = useQueryClient()
  const { copy } = useClipboard()

  const refreshAllUserData = () => {
    queryClient.invalidateQueries({ queryKey: ['getUsers'] })
    queryClient.invalidateQueries({ queryKey: ['getUsersUsage'] })
    queryClient.invalidateQueries({ queryKey: ['/api/users/'] })
  }

  const handleCreateUserSuccess = async (user: UserResponse) => {
    if (user.subscription_url) {
      const subURL = user.subscription_url.startsWith('/') ? window.location.origin + user.subscription_url : user.subscription_url
      await copy(subURL)
      toast.success(t('userSettings.subscriptionUrlCopied'))
    }
    refreshAllUserData()
  }

  const handleCreateUser = () => {
    if (!canCreateUsers) return
    userForm.reset()
    setUserModalOpen(true)
  }

  const handleOpenQuickActions = () => {
    setCommandPaletteOpen(true)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'n' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        handleCreateUser()
      }
      if (event.key === 'r' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        refreshAllUserData()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const systemUsersStatsParams = canReadAllUsers && selectedAdmin && selectedAdmin.username !== 'Total' ? { admin_username: selectedAdmin.username } : undefined

  const { data: systemResourceStatsData } = useGetSystemResourceStats({
    query: {
      refetchInterval: 5000,
    },
  })

  const { data: systemUsersStatsData } = useGetSystemUsersStats(systemUsersStatsParams, {
    query: {
      refetchInterval: 5000,
    },
  })

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="w-full">
        <PageHeader 
          title="MaskPanel Dashboard" 
          description="Veiled Connectivity, Flux Intelligence - RunoFlux" 
          buttonIcon={Bookmark} 
          buttonText="quickActions.title" 
          onButtonClick={handleOpenQuickActions} 
        />
        <Separator />
      </div>

      <div className="w-full px-3 pt-2 sm:px-4">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* RunoFlux Brand Hero - Unique Feature */}
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-violet-600 to-cyan-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <MaskPanelLogo size={56} animated />
                  <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      MaskPanel <span className="text-white/60 font-normal text-sm">by RunoFlux</span>
                      <Badge className="bg-white/20 text-white border-white/20 text-[10px]">VEILED FLUX</Badge>
                    </h2>
                    <p className="text-sm text-white/80 mt-1">Next-gen proxy orchestration with masked identities & adaptive flux routing</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Flux Engine: Active</span>
                      <span>ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ</span>
                      <span>ᚱᚢᚾᛟᚠᛚᚢᛉ</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:gap-3">
                  <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider">Masks</p>
                    <p className="text-xl font-bold font-mono">12</p>
                    <p className="text-[10px] text-emerald-300">▲ 3 active</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider">Flux Score</p>
                    <p className="text-xl font-bold font-mono">94%</p>
                    <p className="text-[10px] text-cyan-300">Optimal</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center">
                    <p className="text-[11px] text-white/60 uppercase tracking-wider">Ghost Nodes</p>
                    <p className="text-xl font-bold font-mono">8</p>
                    <p className="text-[10px] text-violet-200">Veiled</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flux Intelligence & Mask System - Unique Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FluxMeter />
            </div>
            <div className="space-y-4">
              <ObfuscationScore score={94} />
              <GhostModeToggle enabled={ghostEnabled} onToggle={setGhostEnabled} />
            </div>
          </div>

          <RuneDivider className="my-2" />

          <DashboardStatistics resourceData={systemResourceStatsData} usersData={systemUsersStatsData} />
          
          {/* Mask Identities - Unique Feature */}
          <MaskIdentities />

          {canReadNodeStats && <WorkersHealthCard />}
          <Separator className="my-2" />
          
          {canReadAllUsers ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-violet-500" />
                <h3 className="font-semibold text-sm">Admin Flux Analytics</h3>
                <Badge variant="outline" className="font-mono text-[10px]">ᛗ FILTER BY ADMIN</Badge>
              </div>
              <AdminFilterCombobox
                value={selectedAdmin?.username === 'Total' ? 'all' : (selectedAdmin?.username ?? 'all')}
                onValueChange={username => {
                  if (username === 'all') {
                    setSelectedAdmin(totalAdmin)
                    return
                  }
                  if (currentAdmin?.username === username) {
                    setSelectedAdmin(currentAdmin)
                    return
                  }
                  setSelectedAdmin(prev => (prev?.username === username ? prev : { username }))
                }}
                onAdminSelect={admin => {
                  if (!admin) return
                  setSelectedAdmin(admin)
                }}
                className="relative mb-3 w-full max-w-xs sm:mb-4 sm:max-w-sm lg:max-w-md"
              />
              <div className="flex flex-col gap-3 sm:gap-4">
                {selectedAdmin && <AdminStatisticsCard key={selectedAdmin.username} admin={selectedAdmin} systemStats={systemUsersStatsData} currentAdmin={currentAdmin} skipStatsFetch />}
              </div>
            </>
          ) : (
            <AdminStatisticsCard showAdminInfo={false} admin={currentAdmin} systemStats={systemUsersStatsData} currentAdmin={currentAdmin} skipStatsFetch />
          )}

          {/* RunoFlux Footer Branding */}
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <MaskPanelLogo size={28} />
                  <div>
                    <p className="text-xs font-semibold">MaskPanel by RunoFlux • Veiled Flux Engine</p>
                    <p className="text-[11px] text-muted-foreground">Unique features: Flux Balancing, Masked Identities, Ghost Routing, Rune Analytics, Obfuscation Scoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <span>ᛗ</span><span>ᚱ</span><span>ᚠ</span><span>ᛚ</span><span>ᚢ</span><span>ᛉ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isUserModalOpen && <UserModal isDialogOpen={isUserModalOpen} onOpenChange={setUserModalOpen} form={userForm} editingUser={false} onSuccessCallback={handleCreateUserSuccess} />}
    </div>
  )
}

export default Dashboard
