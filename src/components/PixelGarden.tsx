import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Slider } from "./ui/slider"
import { useToast } from "../hooks/use-toast"
import { usePixelGarden } from "../hooks/usePixelGarden"
import { formatUnits, parseUnits, keccak256, toHex } from "viem"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { ALLOWED_STATES } from "../utils/states"

// Configuration - À adapter avec vos vrais addresses de contrats
const CONFIG = {
  CONTRACT_ADDRESS: "0x1234567890123456789012345678901234567890" as `0x${string}`,
  TRUST_TOKEN_ADDRESS: "0x0987654321098765432109876543210987654321" as `0x${string}`,
  CHAIN_ID: 88, // Intuition Testnet (depuis votre hardhat.config.ts)
  RPC_URL: "https://api.intuition-testnet.gelato.digital",
}

const STATE_COLORS: Record<string, string> = {
  empty: "#111111",
  soil: "#8B4513",
  seed: "#D2B48C", 
  sprout: "#9ACD32",
  leaf: "#228B22",
  "flower:red": "#DC143C",
  "flower:yellow": "#FFD700",
  "flower:blue": "#1E90FF",
  "flower:white": "#F5F5F5",
  shrub: "#32CD32",
  tree: "#006400",
  water: "#00BFFF",
  stone: "#696969",
  path: "#D2B48C",
}

type PixelData = {
  state: string
  stake: bigint
  topStates: Array<{ state: string; stake: bigint }>
}

type GridData = Record<string, PixelData>

export default function TrustGardenPixelWar() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { getPixel, getTopStates, setPixel, approveTrust, isLoading, error, gridDimensions } = usePixelGarden(
    CONFIG.CONTRACT_ADDRESS,
    CONFIG.TRUST_TOKEN_ADDRESS,
  )

  const [gridData, setGridData] = useState<GridData>({})
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null)
  const [selectedState, setSelectedState] = useState<string>("soil")
  const [trustAmount, setTrustAmount] = useState<string>("1")
  const [zoom, setZoom] = useState<number>(6) // Zoom optimal par défaut
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isSettingPixel, setIsSettingPixel] = useState<boolean>(false)

  // Load initial grid data - avec memoization pour éviter les boucles infinies
  useEffect(() => {
    const loadGridData = async () => {
      if (!getPixel || !getTopStates || !isConnected) return

      const newGridData: GridData = {}
      
      // Charger une grille réduite pour la démo (16x16)
      const demoSize = 16
      
      for (let x = 0; x < demoSize; x++) {
        for (let y = 0; y < demoSize; y++) {
          try {
            const pixelResult = await getPixel(x, y)
            const topStatesResult = await getTopStates(x, y, 3)

            newGridData[`${x}-${y}`] = {
              state: pixelResult.state || "empty",
              stake: pixelResult.stake || 0n,
              topStates: topStatesResult || [],
            }
          } catch (err) {
            // Default to empty if fetch fails
            newGridData[`${x}-${y}`] = {
              state: "empty",
              stake: 0n,
              topStates: [],
            }
          }
        }
      }

      setGridData(newGridData)
    }

    loadGridData()
  }, [isConnected]) // Seulement dépend de isConnected

  // Handle pixel click
  const handlePixelClick = useCallback((x: number, y: number) => {
    setSelectedPixel({ x, y })
    toast({
      title: "Pixel sélectionné",
      description: `Position (${x}, ${y})`,
    })
  }, [toast])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPixel) return

      let newX = selectedPixel.x
      let newY = selectedPixel.y

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(0, newY - 1)
          break
        case "ArrowDown":
          newY = Math.min(15, newY + 1) // 16x16 grid
          break
        case "ArrowLeft":
          newX = Math.max(0, newX - 1)
          break
        case "ArrowRight":
          newX = Math.min(15, newX + 1) // 16x16 grid
          break
        default:
          return
      }

      e.preventDefault()
      setSelectedPixel({ x: newX, y: newY })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPixel])

  // Calculate cost to flip
  const costToFlip = useMemo(() => {
    if (!selectedPixel) return null

    const pixelData = gridData[`${selectedPixel.x}-${selectedPixel.y}`]
    if (!pixelData) return null

    if (pixelData.state === selectedState) return null

    return pixelData.stake + parseUnits("1", 18) // +1 TRUST token to outbid
  }, [selectedPixel, selectedState, gridData])

  // Handle approve TRUST
  const handleApproveTrust = async () => {
    if (!approveTrust || !trustAmount) return

    setIsApproving(true)
    try {
      const amount = parseUnits(trustAmount, 18)
      await approveTrust(amount)
      toast({
        title: "✅ Approval Successful",
        description: `Approved ${trustAmount} TRUST tokens`,
      })
    } catch (err) {
      toast({
        title: "❌ Approval Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  // Handle set pixel
  const handleSetPixel = async () => {
    if (!selectedPixel || !setPixel || !trustAmount) return

    setIsSettingPixel(true)
    try {
      const amount = parseUnits(trustAmount, 18)
      const stateHash = keccak256(toHex(selectedState))

      await setPixel(selectedPixel.x, selectedPixel.y, stateHash, amount)

      toast({
        title: "🌱 Pixel Set Successfully",
        description: `Set pixel (${selectedPixel.x}, ${selectedPixel.y}) to ${selectedState}`,
      })

      // Update local grid data
      const key = `${selectedPixel.x}-${selectedPixel.y}`
      setGridData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          state: selectedState,
          stake: amount,
        },
      }))
    } catch (err) {
      toast({
        title: "❌ Set Pixel Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsSettingPixel(false)
    }
  }

  // Render pixel grid (16x16 for demo)
  const renderGrid = () => {
    const pixels = []
    const gridSize = 16

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const key = `${x}-${y}`
        const pixelData = gridData[key]
        const isSelected = selectedPixel?.x === x && selectedPixel?.y === y

        let backgroundColor = STATE_COLORS[pixelData?.state || "empty"]

        // Apply heatmap overlay
        if (showHeatmap && pixelData?.topStates.length >= 2) {
          const top1 = pixelData.topStates[0]?.stake || 0n
          const top2 = pixelData.topStates[1]?.stake || 0n
          const delta = top1 - top2
          const deltaPercent = top1 > 0n ? Number((delta * 100n) / top1) : 0

          if (deltaPercent < 10) {
            backgroundColor = `color-mix(in srgb, ${backgroundColor} 70%, red 30%)`
          }
        }

        pixels.push(
          <div
            key={key}
            className={`cursor-pointer transition-all duration-200 border border-white/20 hover:scale-110 hover:shadow-lg hover:shadow-white/20 ${
              isSelected ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-black/50 shadow-xl shadow-emerald-400/30" : ""
            }`}
            style={{
              backgroundColor,
              width: `${zoom * 3}px`,
              height: `${zoom * 3}px`,
              minWidth: `${zoom * 3}px`,
              minHeight: `${zoom * 3}px`,
            }}
            onClick={() => handlePixelClick(x, y)}
            title={`(${x}, ${y}) - ${pixelData?.state || "empty"}`}
          />,
        )
      }
    }

    return pixels
  }

  const selectedPixelData = selectedPixel ? gridData[`${selectedPixel.x}-${selectedPixel.y}`] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            🌱 TrustGarden
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">Stake TRUST tokens to control pixels in the garden!</p>
          
          {/* Wallet Connection */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isConnected ? (
              <Button 
                onClick={() => connect({ connector: injected() })}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                🔗 Connect Wallet
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                  <span className="text-sm font-medium">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => disconnect()}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 backdrop-blur-sm font-medium"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="xl:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl max-h-[90vh] overflow-auto">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    🎨 16x16 Demo Garden
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Label className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity">
                      <input 
                        type="checkbox" 
                        checked={showHeatmap} 
                        onChange={(e) => setShowHeatmap(e.target.checked)} 
                        className="rounded border-white/30 bg-white/10"
                      />
                      <span className="text-sm font-medium">🔥 Heatmap</span>
                    </Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <Label className="text-sm font-medium text-white">Zoom: {zoom}x</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[zoom]}
                          onValueChange={([value]) => setZoom(value)}
                          min={3}
                          max={12}
                          step={1}
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setZoom(6)}
                          className="text-xs border-white/30 hover:bg-white/10"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center p-6">
                <div
                  className="grid grid-cols-16 gap-0 border border-white/20 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(16, ${zoom * 3}px)`,
                    width: 'fit-content',
                  }}
                >
                  {renderGrid()}
                </div>
                <div className="mt-4 text-center text-sm opacity-75">
                  Use arrow keys to navigate • Click to select pixels
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Palette */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  🎨 State Palette
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedState} onValueChange={setSelectedState}>
                  <div className="grid grid-cols-1 gap-3">
                    {ALLOWED_STATES.map((state) => (
                      <div key={state} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <RadioGroupItem 
                          value={state} 
                          id={state}
                          className="border-emerald-400 text-emerald-400 focus:ring-emerald-400"
                        />
                        <Label 
                          htmlFor={state} 
                          className="flex items-center gap-3 cursor-pointer text-white font-medium flex-1"
                        >
                          <div
                            className="w-6 h-6 border-2 border-white/40 rounded-lg shadow-sm"
                            style={{ backgroundColor: STATE_COLORS[state] }}
                          />
                          <span className="capitalize">{state}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ⚡ Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="trust-amount" className="text-sm font-medium text-white">Amount (TRUST)</Label>
                  <Input
                    id="trust-amount"
                    type="number"
                    value={trustAmount}
                    onChange={(e) => setTrustAmount(e.target.value)}
                    placeholder="1.0"
                    min="0"
                    step="0.1"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                  />
                </div>

                <Button
                  onClick={handleApproveTrust}
                  disabled={!isConnected || isApproving || !trustAmount}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isApproving ? "⏳ Approving..." : "💰 Approve TRUST"}
                </Button>

                <Button
                  onClick={handleSetPixel}
                  disabled={!isConnected || !selectedPixel || isSettingPixel || !trustAmount}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSettingPixel ? "⏳ Setting..." : "🌱 Set Pixel"}
                </Button>

                {costToFlip && (
                  <div className="text-sm text-yellow-300 bg-yellow-900/20 p-2 rounded">
                    💡 Cost to flip: {formatUnits(costToFlip, 18)} TRUST
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pixel Info */}
            {selectedPixel && selectedPixelData && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    📍 Pixel ({selectedPixel.x}, {selectedPixel.y})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border border-white/30 rounded"
                      style={{ backgroundColor: STATE_COLORS[selectedPixelData.state] }}
                    />
                    <span className="font-medium text-white">{selectedPixelData.state}</span>
                  </div>

                  <div className="text-sm text-white/70">
                    Current stake: {formatUnits(selectedPixelData.stake, 18)} TRUST
                  </div>

                  {selectedPixelData.topStates.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1 text-white">Top States:</div>
                      <div className="space-y-1">
                        {selectedPixelData.topStates.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-xs flex justify-between text-white/80">
                            <span>{item.state}</span>
                            <span>{formatUnits(item.stake, 18)} TRUST</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
