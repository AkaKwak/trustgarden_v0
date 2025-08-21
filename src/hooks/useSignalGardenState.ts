import { useState, useEffect, useRef } from 'react'
import { PixelType } from '../utils/signalTypes'

// Hook pour gérer l'état de SignalGarden
export function useSignalGardenState() {
  // État local
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null)
  const [trustAmount, setTrustAmount] = useState<string>('1')
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)
  const stakingPanelRef = useRef<HTMLDivElement>(null)

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

  // Handlers
  const handlePixelSelect = (x: number, y: number) => {
    setSelectedPixel({ x, y })
  }

  const handlePixelDeselect = () => {
    setSelectedPixel(null)
  }

  const handleTrustAmountChange = (amount: string) => {
    setTrustAmount(amount)
  }

  const handleHeatmapToggle = (show: boolean) => {
    setShowHeatmap(show)
  }

  return {
    // État
    selectedPixel,
    trustAmount,
    showHeatmap,
    stakingPanelRef,
    
    // Handlers
    handlePixelSelect,
    handlePixelDeselect,
    handleTrustAmountChange,
    handleHeatmapToggle,
    
    // Setters directs
    setSelectedPixel,
    setTrustAmount,
    setShowHeatmap
  }
}
