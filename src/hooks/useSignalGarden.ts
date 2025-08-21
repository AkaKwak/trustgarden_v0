import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { PixelType } from '../utils/signalTypes'
import { useContracts } from './useContracts'
import { useGrid } from './useGrid'

export function useSignalGarden() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { setPixel, approveTrust, trustBalance, allowance, isSettingPixel, isApproving } = useContracts()
  const { gridData, gridStats, getPixel, updatePixel } = useGrid()

  // Fonction pour staker un pixel
  const stakePixel = useCallback(async (
    x: number,
    y: number,
    pixelType: PixelType,
    amount: string
  ) => {
    if (!address) {
      throw new Error('Wallet non connecté')
    }

    try {
      setIsLoading(true)
      setError(null)

      const amountWei = parseUnits(amount, 18)
      
      // Mise à jour locale immédiate
      updatePixel(x, y, pixelType, amountWei)

      // TODO: Décommenter quand le contrat sera déployé
      // if (setPixel) {
      //   setPixel({
      //     args: [x, y, pixelType, amountWei],
      //   })
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du staking')
      setIsLoading(false)
    }
  }, [address, setPixel, updatePixel])

  // Fonction pour approuver les tokens
  const approveTokens = useCallback(async (amount: string) => {
    if (!address) {
      throw new Error('Wallet non connecté')
    }

    try {
      setIsLoading(true)
      setError(null)

      const amountWei = parseUnits(amount, 18)
      
      // Simulation de l'approbation (à remplacer par l'appel au contrat)
      console.log('Approbation simulée:', amountWei.toString())

      // TODO: Décommenter quand le contrat sera déployé
      // if (approveTrust) {
      //   approveTrust({
      //     args: [APP_CONFIG.contracts.pixelGarden as `0x${string}`, amountWei],
      //   })
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'approbation')
      setIsLoading(false)
    }
  }, [address, approveTrust])

  // Effet pour gérer le chargement
  const isLoadingState = isLoading || isSettingPixel || isApproving

  return {
    // État
    gridData,
    gridStats,
    isLoading: isLoadingState,
    error,
    trustBalance: trustBalance || 0n,
    allowance: allowance || 0n,
    isConnected,
    address,
    
    // Actions
    getPixel,
    stakePixel,
    approveTokens,
    
    // Utilitaires
    isContractConfigured: true, // Pour compatibilité
  }
}
