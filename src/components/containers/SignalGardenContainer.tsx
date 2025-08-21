import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { PixelType, getPixelLabel } from '../../utils/signalTypes'
import { useSignalGarden, useToast } from '../../hooks'
import { useGridZoom } from '../../hooks/useGridZoom'
import { useStageSize } from '../../hooks/useStageSize'
import { useSignalGardenState } from '../../hooks/useSignalGardenState'
import { SignalGardenLayout } from '../layouts/SignalGardenLayout'

// Container principal - Logique métier + État
export function SignalGardenContainer() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  // Hooks métier
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

  // Hooks d'état et techniques
  const {
    selectedPixel,
    trustAmount,
    showHeatmap,
    stakingPanelRef,
    handlePixelSelect,
    handleTrustAmountChange,
    handleHeatmapToggle
  } = useSignalGardenState()
  
  const { containerRef, optimalZoom } = useStageSize()
  const { zoom, setZoomLevel } = useGridZoom(optimalZoom)

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
    handlePixelSelect(x, y)
    
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



  // Récupérer les données du pixel sélectionné
  const selectedPixelData = selectedPixel 
    ? gridData[`${selectedPixel.x}-${selectedPixel.y}`] 
    : null

  // Props pour le layout
  const layoutProps = {
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
    onPixelClick: handlePixelClick,
    onStake: handleStake,
    onApprove: handleApprove,
    onTrustAmountChange: handleTrustAmountChange,
    onZoomChange: setZoomLevel,
    onHeatmapToggle: handleHeatmapToggle,
    
    // Wallet
    address,
    isConnected,
    connect,
    disconnect
  }

  return <SignalGardenLayout {...layoutProps} />
}
