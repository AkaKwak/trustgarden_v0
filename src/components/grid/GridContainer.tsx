import { ReactNode } from 'react'
import { GridContainerProps } from './types'
import { GRID_STYLES } from './constants'

export function GridContainer({ 
  children, 
  gridSize, 
  pixelSize, 
  className = "" 
}: GridContainerProps) {
  return (
    <div className={`${GRID_STYLES.container.base} ${className}`}>
      {/* Conteneur "bulle" externe */}
      <div className={GRID_STYLES.container.bubble}>
        {/* Grille interne */}
        <div
          className={GRID_STYLES.grid.base}
          style={{
            gridTemplateColumns: `repeat(32, ${pixelSize}px)`,
            gridTemplateRows: `repeat(32, ${pixelSize}px)`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            minWidth: `${gridSize}px`,
            minHeight: `${gridSize}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
