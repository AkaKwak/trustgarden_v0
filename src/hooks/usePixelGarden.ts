import { useState, useCallback } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi, keccak256, toHex } from 'viem'
import { ALLOWED_STATES, stateKey } from '@/utils/states'

// ABI pour PixelGarden basé sur votre smart contract
const PIXEL_GARDEN_ABI = parseAbi([
  'function getPixel(uint32 x, uint32 y) view returns (bytes32 current, uint64 lastUpdate)',
  'function getPixelState(uint32 x, uint32 y, bytes32 stateHash) view returns (uint256 stake)',
  'function setPixel(uint32 x, uint32 y, bytes32 stateHash, uint256 amount)',
  'function getAllowedStates() view returns (string[] memory)',
  'function trustToken() view returns (address)',
  'function width() view returns (uint32)',
  'function height() view returns (uint32)',
  'event PixelSet(uint32 indexed x, uint32 indexed y, bytes32 indexed stateHash, address user, uint256 amount)'
])

const TRUST_TOKEN_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)'
])

interface PixelData {
  state: string
  stake: bigint
}

interface TopState {
  state: string
  stake: bigint
}

export function usePixelGarden(contractAddress: `0x${string}`, trustTokenAddress: `0x${string}`) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Lire les dimensions de la grille - avec memoization
  const { data: width } = useReadContract({
    address: contractAddress,
    abi: PIXEL_GARDEN_ABI,
    functionName: 'width',
  })

  const { data: height } = useReadContract({
    address: contractAddress,
    abi: PIXEL_GARDEN_ABI,
    functionName: 'height',
  })

  // Fonction pour obtenir les données d'un pixel
  const getPixel = useCallback(async (x: number, y: number): Promise<PixelData> => {
    try {
      // Pour la démo, on retourne des données simulées
      // À remplacer par la vraie logique avec useReadContract
      const states = ['empty', 'soil', 'seed', 'sprout', 'leaf', 'flower:red']
      const randomState = states[Math.floor(Math.random() * states.length)]
      
      return {
        state: randomState,
        stake: BigInt(Math.floor(Math.random() * 100)) * BigInt(10**18)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  // Fonction pour obtenir les top states d'un pixel
  const getTopStates = useCallback(async (x: number, y: number, limit: number): Promise<TopState[]> => {
    try {
      // Simulation des top states
      const topStates: TopState[] = []
      for (let i = 0; i < Math.min(limit, 3); i++) {
        const state = ALLOWED_STATES[Math.floor(Math.random() * ALLOWED_STATES.length)]
        topStates.push({
          state,
          stake: BigInt(Math.floor(Math.random() * 50) + 10) * BigInt(10**18)
        })
      }
      
      return topStates.sort((a, b) => b.stake > a.stake ? 1 : -1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  // Fonction pour approuver les tokens TRUST
  const approveTrust = useCallback(async (amount: bigint) => {
    try {
      setIsLoading(true)
      setError(null)

      await writeContract({
        address: trustTokenAddress,
        abi: TRUST_TOKEN_ABI,
        functionName: 'approve',
        args: [contractAddress, amount],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [writeContract, trustTokenAddress, contractAddress])

  // Fonction pour définir un pixel
  const setPixel = useCallback(async (x: number, y: number, stateHash: `0x${string}`, amount: bigint) => {
    try {
      setIsLoading(true)
      setError(null)

      await writeContract({
        address: contractAddress,
        abi: PIXEL_GARDEN_ABI,
        functionName: 'setPixel',
        args: [x, y, stateHash, amount],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [writeContract, contractAddress])

  return {
    getPixel,
    getTopStates,
    setPixel,
    approveTrust,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    gridDimensions: { width: width || 64, height: height || 64 },
    allowedStates: ALLOWED_STATES
  }
}
