import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

interface StakingFormProps {
  trustAmount: string
  setTrustAmount: (amount: string) => void
  isLoading: boolean
  needsApproval: boolean
  onApprove: () => void
}

// Composant pour le formulaire de staking
export function StakingForm({
  trustAmount,
  setTrustAmount,
  isLoading,
  needsApproval,
  onApprove
}: StakingFormProps) {
  return (
    <Card className="w-full flex-shrink-0">
      <CardContent className="pt-6 space-y-4">
        {/* Montant */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Montant TTRUST</Label>
          <Input
            id="amount"
            type="number"
            value={trustAmount}
            onChange={(e) => setTrustAmount(e.target.value)}
            placeholder="0.0"
            className="text-center"
          />
        </div>

        {/* Bouton d'approbation si nécessaire */}
        {needsApproval && (
          <Button
            onClick={onApprove}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Approuver TTRUST
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
