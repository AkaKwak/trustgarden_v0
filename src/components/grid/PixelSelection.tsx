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
      // Animation d'apparition
      rectRef.current.to({
        scaleX: SELECTION_CONFIG.dimensions.scale,
        scaleY: SELECTION_CONFIG.dimensions.scale,
        shadowBlur: SELECTION_CONFIG.dimensions.shadowBlur,
        duration: SELECTION_CONFIG.animations.duration.appear,
        easing: Konva.Easings[SELECTION_CONFIG.animations.easing.appear as keyof typeof Konva.Easings]
      })

      // Animation de pulsation continue
      const pulseAnimation = () => {
        if (rectRef.current && isSelected) {
          rectRef.current.to({
            shadowBlur: SELECTION_CONFIG.animations.pulse.maxShadow,
            duration: SELECTION_CONFIG.animations.duration.pulse,
            easing: Konva.Easings[SELECTION_CONFIG.animations.easing.pulse as keyof typeof Konva.Easings],
            onFinish: () => {
              if (rectRef.current && isSelected) {
                rectRef.current.to({
                  shadowBlur: SELECTION_CONFIG.animations.pulse.minShadow,
                  duration: SELECTION_CONFIG.animations.duration.pulse,
                  easing: Konva.Easings[SELECTION_CONFIG.animations.easing.pulse as keyof typeof Konva.Easings],
                  onFinish: pulseAnimation
                })
              }
            }
          })
        }
      }
      
      pulseAnimation()
    } else if (rectRef.current && !isSelected) {
      // Animation de disparition
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
      x={x * size - 2}
      y={y * size - 2}
      width={size + 4}
      height={size + 4}
      fill="transparent"
      stroke={SELECTION_CONFIG.colors.primary}
      strokeWidth={SELECTION_CONFIG.dimensions.strokeWidth}
      shadowBlur={SELECTION_CONFIG.dimensions.shadowBlur}
      shadowColor={SELECTION_CONFIG.colors.shadow}
      shadowOpacity={SELECTION_CONFIG.dimensions.shadowOpacity}
      cornerRadius={SELECTION_CONFIG.dimensions.cornerRadius}
      listening={false}
    />
  )
}
