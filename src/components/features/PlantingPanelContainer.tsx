import { PixelType } from '../../utils/signalTypes'
import { PixelTypeSelector } from './PixelTypeSelector'
import { StakingForm } from './StakingForm'
import { TrustBalanceDisplay } from './TrustBalanceDisplay'
import { PixelStatusDisplay } from './PixelStatusDisplay'

interface PlantingPanelContainerProps {
  selectedPixel: { x: number; y: number } | null
  onStake: (type: PixelType) => void
  trustAmount: string
  setTrustAmount: (amount: string) => void
  isLoading: boolean
  trustBalance: bigint
  allowance: bigint
  onApprove: () => void
  pixelData: any
}

// Container pour le panel de plantation - Logique métier
export function PlantingPanelContainer({
  selectedPixel,
  onStake,
  trustAmount,
  setTrustAmount,
  isLoading,
  trustBalance,
  allowance,
  onApprove,
  pixelData
}: PlantingPanelContainerProps) {
  
  // Calculer si l'approbation est nécessaire
  const needsApproval = allowance < parseFloat(trustAmount || '0')

  // Props pour les sous-composants
  const pixelStatusProps = {
    selectedPixel,
    pixelData
  }

  const stakingFormProps = {
    trustAmount,
    setTrustAmount,
    isLoading,
    needsApproval,
    onApprove
  }

  const pixelTypeSelectorProps = {
    onStake,
    isLoading,
    trustAmount
  }

  const trustBalanceProps = {
    trustBalance
  }

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Affichage du statut du pixel */}
      <PixelStatusDisplay {...pixelStatusProps} />
      
      {/* Formulaire de staking */}
      <StakingForm {...stakingFormProps} />
      
      {/* Sélecteur de type de pixel */}
      <PixelTypeSelector {...pixelTypeSelectorProps} />
      
      {/* Affichage du solde */}
      <TrustBalanceDisplay {...trustBalanceProps} />
    </div>
  )
}
