import { formatUnits } from 'viem'

interface TrustBalanceDisplayProps {
  trustBalance: bigint
}

// Composant pour afficher le solde TTRUST
export function TrustBalanceDisplay({ trustBalance }: TrustBalanceDisplayProps) {
  return (
    <div className="text-center text-sm text-gray-500 pt-2 border-t">
      Solde: {formatUnits(trustBalance, 18)} TTRUST
    </div>
  )
}
