import { useContractRead, useContractWrite } from 'wagmi'
import { parseUnits } from 'viem'
import { PIXEL_GARDEN_ABI, TRUST_TOKEN_ABI } from '../config/abis'
import { APP_CONFIG } from '../config/wagmi'

export function useContracts() {
  // Écriture pour staker un pixel
  const { write: setPixel, isPending: isSettingPixel } = useContractWrite({
    address: APP_CONFIG.contracts.pixelGarden as `0x${string}`,
    abi: PIXEL_GARDEN_ABI,
    functionName: 'setPixel',
  })

  // Écriture pour approuver les tokens
  const { write: approveTrust, isPending: isApproving } = useContractWrite({
    address: APP_CONFIG.contracts.trustToken as `0x${string}`,
    abi: TRUST_TOKEN_ABI,
    functionName: 'approve',
  })

  // Lecture du solde TTRUST
  const { data: trustBalance = 0n } = useContractRead({
    address: APP_CONFIG.contracts.trustToken as `0x${string}`,
    abi: TRUST_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [APP_CONFIG.contracts.pixelGarden as `0x${string}`],
  })

  // Lecture de l'allowance
  const { data: allowance = 0n } = useContractRead({
    address: APP_CONFIG.contracts.trustToken as `0x${string}`,
    abi: TRUST_TOKEN_ABI,
    functionName: 'allowance',
    args: [APP_CONFIG.contracts.pixelGarden as `0x${string}`, APP_CONFIG.contracts.pixelGarden as `0x${string}`],
  })

  return {
    setPixel,
    approveTrust,
    trustBalance,
    allowance,
    isSettingPixel,
    isApproving,
  }
}
