import { useState, useEffect, useRef } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { PixelType, getPixelLabel } from '../utils/signalTypes'
import { APP_CONFIG } from '../config/wagmi'
import { useSignalGarden, useToast } from '../hooks'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  ResponsiveGrid,
  GridControls,
  PlantingPanel,
  StatsCards
} from './ui'





// Composant principal SignalGarden
export default function SignalGarden() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const {
    gridData,
    gridStats,
    isLoading,
    error,
    trustBalance,
    allowance,
    getPixel,
    stakePixel,
    approveTokens,
    isContractConfigured,
  } = useSignalGarden()

  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null)
  const [trustAmount, setTrustAmount] = useState<string>('1')
            const [zoom, setZoom] = useState<number>(4) // 133% de zoom (niveau 4 sur 10)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)
  const stakingPanelRef = useRef<HTMLDivElement>(null)

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  // Gérer le clic sur un pixel
  const handlePixelClick = async (x: number, y: number) => {
    setSelectedPixel({ x, y })
    
    // Charger les données du pixel
    try {
      await getPixel(x, y)
    } catch (err) {
      console.error('Erreur lors du chargement du pixel:', err)
    }
  }

  // Gérer le staking
  const handleStake = async (pixelType: PixelType) => {
    if (!selectedPixel || !trustAmount) return

    try {
      await stakePixel(selectedPixel.x, selectedPixel.y, pixelType, trustAmount)
      toast({
        title: 'Staking en cours',
        description: `Staking ${trustAmount} TTRUST comme ${getPixelLabel(pixelType)}`,
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur lors du staking',
        variant: 'destructive',
      })
    }
  }

  // Gérer l'approbation
  const handleApprove = async () => {
    try {
      await approveTokens(trustAmount)
      toast({
        title: 'Approbation en cours',
        description: 'Approbation des tokens TTRUST',
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur lors de l\'approbation',
        variant: 'destructive',
      })
    }
  }

  // Gérer le clic à l'extérieur du panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stakingPanelRef.current && !stakingPanelRef.current.contains(event.target as Node)) {
        setSelectedPixel(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Récupérer les données du pixel sélectionné
  const selectedPixelData = selectedPixel 
    ? gridData[`${selectedPixel.x}-${selectedPixel.y}`] 
    : null

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
      <div className="h-full flex">
        {/* Grille de pixels - 2/3 de la page à gauche */}
        <div className="w-2/3 h-full flex flex-col p-8">
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <ResponsiveGrid
              gridData={gridData}
              onPixelClick={handlePixelClick}
              zoom={zoom}
              selectedPixel={selectedPixel}
              onZoomChange={setZoom}
            />
          </div>
        </div>

        {/* Tous les autres éléments - 1/3 de la page à droite */}
        <div className="w-1/3 h-full flex flex-col p-6 space-y-6 overflow-y-auto bg-white/50 backdrop-blur-sm border-l border-gray-200/50">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🌱 Signal Garden
            </h1>
            <p className="text-base text-gray-600 mb-4">
              Token-curated knowledge sur Intuition Testnet
            </p>

            {/* Wallet Connection */}
            <div className="flex justify-center gap-4 mb-4">
              {!isConnected ? (
                <Button onClick={() => connect({ connector: injected() })}>
                  Connecter Wallet
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <Button variant="outline" onClick={() => disconnect()}>
                    Déconnecter
                  </Button>
                </div>
              )}
            </div>

            {/* Network Info */}
            <div className="text-sm text-gray-500">
              Network: Intuition Testnet (Chain ID: {APP_CONFIG.CHAIN_ID})
            </div>
          </div>

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
                onZoomChange={setZoom}
                showHeatmap={showHeatmap}
                onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
              />
            </CardContent>
          </Card>

          {/* Panel de plantation */}
          <div className="flex-1" ref={stakingPanelRef}>
            <PlantingPanel
              selectedPixel={selectedPixel}
              onStake={handleStake}
              trustAmount={trustAmount}
              setTrustAmount={setTrustAmount}
              isLoading={isLoading}
              trustBalance={trustBalance}
              allowance={allowance}
              onApprove={handleApprove}
              pixelData={selectedPixelData}
            />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 text-center text-sm text-gray-500">
            <p>
              🌱 Signal Garden - Créez un monde, générez des connaissances !
            </p>
            <p className="mt-1">
              🪨 Rocher | 🌳 Arbre | 🌊 Eau | 🌸 Fleur | 🌱 Herbe | 🏖️ Sable | 🌿 Buisson | 🍄 Champignon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
