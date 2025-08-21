import { RefObject } from 'react'
import { PixelType } from '../../utils/signalTypes'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  GridControls,
  AppHeader,
  StatsCards,
  ScrollContainer
} from '../ui'
import { PlantingPanelContainer } from '../features'
import { KonvaGrid } from '../grid/KonvaGrid'
import { LAYOUT_CONFIG } from '../../config/layout'

// Types pour les props du layout
interface SignalGardenLayoutProps {
  // Données
  gridData: Record<string, any>
  gridStats: any
  selectedPixel: { x: number; y: number } | null
  selectedPixelData: any
  trustAmount: string
  trustBalance: string
  allowance: string
  isLoading: boolean
  isContractConfigured: boolean
  error: string | null
  
  // État UI
  zoom: number
  showHeatmap: boolean
  stakingPanelRef: RefObject<HTMLDivElement>
  
  // Handlers
  onPixelClick: (x: number, y: number) => void
  onStake: (pixelType: PixelType) => void
  onApprove: () => void
  onTrustAmountChange: (amount: string) => void
  onZoomChange: (zoom: number) => void
  onHeatmapToggle: (show: boolean) => void
  
  // Wallet
  address: string | undefined
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

// Layout principal - Structure HTML/CSS uniquement
export function SignalGardenLayout({
  // Données
  gridData,
  gridStats,
  selectedPixel,
  selectedPixelData,
  trustAmount,
  trustBalance,
  allowance,
  isLoading,
  isContractConfigured,
  error,
  
  // État UI
  zoom,
  showHeatmap,
  stakingPanelRef,
  
  // Handlers
  onPixelClick,
  onStake,
  onApprove,
  onTrustAmountChange,
  onZoomChange,
  onHeatmapToggle,
  
  // Wallet
  address,
  isConnected,
  connect,
  disconnect
}: SignalGardenLayoutProps) {
  
  // Gestion d'erreur globale
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Recharger l'application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Grille de pixels - 2/3 de la page à gauche */}
      <div className="absolute left-0 top-0 w-2/3 h-full">
        <div className="w-full h-full">
          <KonvaGrid
            gridData={gridData}
            onPixelClick={onPixelClick}
            zoom={zoom}
            selectedPixel={selectedPixel}
            onZoomChange={onZoomChange}
          />
        </div>
      </div>

      {/* Panel de droite - 1/3 de la page */}
      <div className={LAYOUT_CONFIG.PANEL_CONTAINER} style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Header fixe */}
        <AppHeader />
        
        {/* Contenu scrollable sans scrollbars */}
        <ScrollContainer className="flex-1">
          <div className="space-y-3">
            {/* Stats */}
            <StatsCards gridStats={gridStats} />

            {/* Contrôles de la carte */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contrôles de la Carte</CardTitle>
              </CardHeader>
              <CardContent>
                <GridControls
                  zoom={zoom}
                  onZoomChange={onZoomChange}
                  showHeatmap={showHeatmap}
                  onToggleHeatmap={() => onHeatmapToggle(!showHeatmap)}
                />
              </CardContent>
            </Card>

            {/* Panel de plantation */}
            <div ref={stakingPanelRef}>
              <PlantingPanelContainer
                selectedPixel={selectedPixel}
                onStake={onStake}
                trustAmount={trustAmount}
                setTrustAmount={onTrustAmountChange}
                isLoading={isLoading}
                trustBalance={trustBalance}
                allowance={allowance}
                onApprove={onApprove}
                pixelData={selectedPixelData}
              />
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 py-2">
              <p>🌱 Signal Garden - Créez un monde, générez des connaissances !</p>
              <p className="mt-1">🪨 Rocher | 🌳 Arbre | 🌊 Eau | 🌸 Fleur | 🌱 Herbe | 🏖️ Sable | 🌿 Buisson | 🍄 Champignon</p>
            </div>
          </div>
        </ScrollContainer>
      </div>
    </div>
  )
}
