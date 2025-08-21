// ===== INDICATEUR DE PIXEL ÉLÉGANT =====

import { Group, Rect, Text } from 'react-konva'
import { SELECTION_CONFIG } from './selectionConfig'
import { getPixelEmoji } from '../../utils/pixelUtils'

interface PixelIndicatorProps {
  x: number
  y: number
  size: number
  pixelType: string
  isVisible: boolean
}

export function PixelIndicator({ 
  x, 
  y, 
  size, 
  pixelType, 
  isVisible 
}: PixelIndicatorProps) {
  if (!isVisible) return null

  // S'assurer que pixelType n'est pas vide
  const displayType = pixelType || 'Vide'
  const emoji = getPixelEmoji(pixelType as any) || '⚪'

  const indicatorX = x * size + SELECTION_CONFIG.indicator.offset.x
  const indicatorY = y * size + SELECTION_CONFIG.indicator.offset.y

  return (
    <Group>
      {/* Fond avec effet de flou */}
      <Rect
        x={indicatorX}
        y={indicatorY}
        width={SELECTION_CONFIG.indicator.size.width}
        height={SELECTION_CONFIG.indicator.size.height}
        fill={SELECTION_CONFIG.colors.background}
        stroke={SELECTION_CONFIG.colors.border}
        strokeWidth={1}
        cornerRadius={SELECTION_CONFIG.indicator.borderRadius}
        shadowBlur={SELECTION_CONFIG.indicator.backdropBlur}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowOpacity={0.3}
      />
      
      {/* Coordonnées */}
      <Text
        x={indicatorX + 8}
        y={indicatorY + 6}
        text={`${x}, ${y}`}
        fontSize={SELECTION_CONFIG.indicator.fontSize.coordinates}
        fontFamily="Inter, sans-serif"
        fill="#1e293b"
        fontStyle="bold"
      />
      
      {/* Type de pixel avec emoji */}
      <Text
        x={indicatorX + 8}
        y={indicatorY + 20}
        text={`${emoji} ${displayType}`}
        fontSize={SELECTION_CONFIG.indicator.fontSize.type}
        fontFamily="Inter, sans-serif"
        fill="#475569"
        opacity={0.9}
      />
    </Group>
  )
}
