import { Text, Group } from 'react-konva'
import { SELECTION_CONFIG } from './selectionConfig'

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

  const indicatorX = x * size + size / 2 + SELECTION_CONFIG.indicator.offset.x
  const indicatorY = y * size + SELECTION_CONFIG.indicator.offset.y

  return (
    <Group>
      {/* Fond de l'indicateur */}
      <Text
        x={indicatorX}
        y={indicatorY}
        width={SELECTION_CONFIG.indicator.size.width}
        height={SELECTION_CONFIG.indicator.size.height}
        fill={SELECTION_CONFIG.colors.background}
        fontSize={SELECTION_CONFIG.indicator.fontSize.coordinates}
        fontFamily="Inter, sans-serif"
        align="center"
        verticalAlign="middle"
        text={`${x}, ${y}`}
        padding={5}
        cornerRadius={4}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ 
          x: SELECTION_CONFIG.indicator.size.width, 
          y: SELECTION_CONFIG.indicator.size.height 
        }}
        fillLinearGradientColorStops={[
          0, SELECTION_CONFIG.colors.background, 
          1, '#374151'
        ]}
        shadowBlur={5}
        shadowColor="#000"
        shadowOpacity={0.3}
        shadowOffset={{ x: 0, y: 2 }}
      />
      
      {/* Type du pixel */}
      <Text
        x={indicatorX + 10}
        y={indicatorY + SELECTION_CONFIG.indicator.size.height + 5}
        width={SELECTION_CONFIG.indicator.size.width - 20}
        height={20}
        fill={SELECTION_CONFIG.colors.text}
        fontSize={SELECTION_CONFIG.indicator.fontSize.type}
        fontFamily="Inter, sans-serif"
        align="center"
        verticalAlign="middle"
        text={pixelType}
        padding={2}
        cornerRadius={2}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ 
          x: SELECTION_CONFIG.indicator.size.width - 20, 
          y: 20 
        }}
        fillLinearGradientColorStops={[
          0, SELECTION_CONFIG.colors.primary, 
          1, SELECTION_CONFIG.colors.secondary
        ]}
        shadowBlur={3}
        shadowColor="#000"
        shadowOpacity={0.2}
      />
    </Group>
  )
}
