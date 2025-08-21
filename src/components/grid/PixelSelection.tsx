// ===== COMPOSANT DE SÉLECTION ÉLÉGANTE =====

import { useEffect, useRef } from 'react'
import { Rect } from 'react-konva'
import Konva from 'konva'
import { SELECTION_CONFIG } from './selectionConfig'

interface PixelSelectionProps {
  x: number
  y: number
  size: number
  isSelected: boolean
}

export function PixelSelection({ x, y, size, isSelected }: PixelSelectionProps) {
  const rectRef = useRef<Konva.Rect>(null)

  useEffect(() => {
    if (rectRef.current && isSelected) {
      // Animation d'apparition élégante
      rectRef.current.to({
        scaleX: SELECTION_CONFIG.states.selected.scale,
        scaleY: SELECTION_CONFIG.states.selected.scale,
        shadowBlur: SELECTION_CONFIG.states.selected.shadowBlur,
        duration: SELECTION_CONFIG.animations.duration.appear,
        easing: Konva.Easings[SELECTION_CONFIG.animations.easing.appear as keyof typeof Konva.Easings]
      })

      // Animation de pulsation subtile simplifiée
      const pulseAnimation = () => {
        if (rectRef.current && isSelected) {
          rectRef.current.to({
            shadowBlur: SELECTION_CONFIG.animations.pulse.maxShadow,
            scaleX: SELECTION_CONFIG.animations.pulse.maxScale,
            scaleY: SELECTION_CONFIG.animations.pulse.maxScale,
            duration: SELECTION_CONFIG.animations.duration.pulse / 2,
            easing: Konva.Easings[SELECTION_CONFIG.animations.easing.pulse as keyof typeof Konva.Easings],
            onFinish: () => {
              if (rectRef.current && isSelected) {
                rectRef.current.to({
                  shadowBlur: SELECTION_CONFIG.animations.pulse.minShadow,
                  scaleX: SELECTION_CONFIG.animations.pulse.minScale,
                  scaleY: SELECTION_CONFIG.animations.pulse.minScale,
                  duration: SELECTION_CONFIG.animations.duration.pulse / 2,
                  easing: Konva.Easings[SELECTION_CONFIG.animations.easing.pulse as keyof typeof Konva.Easings],
                  onFinish: pulseAnimation
                })
              }
            }
          })
        }
      }
      
      // Démarrer l'animation de pulsation
      setTimeout(pulseAnimation, SELECTION_CONFIG.animations.duration.appear * 1000)
    } else if (rectRef.current && !isSelected) {
      // Animation de disparition fluide
      rectRef.current.to({
        scaleX: 1,
        scaleY: 1,
        shadowBlur: 0,
        duration: SELECTION_CONFIG.animations.duration.disappear,
        easing: Konva.Easings[SELECTION_CONFIG.animations.easing.disappear as keyof typeof Konva.Easings]
      })
    }
  }, [isSelected])

  if (!isSelected) return null

  return (
    <Rect
      ref={rectRef}
      x={x * size - SELECTION_CONFIG.dimensions.offset}
      y={y * size - SELECTION_CONFIG.dimensions.offset}
      width={size + (SELECTION_CONFIG.dimensions.offset * 2)}
      height={size + (SELECTION_CONFIG.dimensions.offset * 2)}
      fill="transparent"
      stroke={SELECTION_CONFIG.colors.primary}
      strokeWidth={SELECTION_CONFIG.states.selected.strokeWidth}
      shadowBlur={SELECTION_CONFIG.states.selected.shadowBlur}
      shadowColor={SELECTION_CONFIG.colors.shadow}
      shadowOpacity={SELECTION_CONFIG.dimensions.shadowOpacity}
      cornerRadius={SELECTION_CONFIG.dimensions.cornerRadius}
      listening={false}
    />
  )
}
