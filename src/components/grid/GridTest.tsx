// ===== COMPOSANT DE TEST SIMPLE =====

import React, { useState } from 'react'
import { KonvaGrid } from './KonvaGrid'
import { PixelType } from '../../utils/pixelTypes'

// Données de test simples avec plus de variété
const createTestData = () => {
  const testData: Record<string, any> = {}
  
  // Ajouter quelques pixels de test avec différents types
  testData['5-5'] = { dominantType: PixelType.ROCKS }
  testData['8-8'] = { dominantType: PixelType.TREES }
  testData['12-12'] = { dominantType: PixelType.WATER }
  testData['15-15'] = { dominantType: PixelType.FLOWERS }
  testData['20-20'] = { dominantType: PixelType.GRASS }
  testData['25-25'] = { dominantType: PixelType.SAND }
  testData['10-10'] = { dominantType: PixelType.BUSHES }
  testData['18-18'] = { dominantType: PixelType.MUSHROOMS }
  
  return testData
}

export function GridTest() {
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = useState(100)
  const testData = createTestData()

  const handlePixelClick = (x: number, y: number) => {
    console.log(`Pixel cliqué: (${x}, ${y})`)
    console.log(`Données du pixel:`, testData[`${x}-${y}`])
    setSelectedPixel({ x, y })
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  // Obtenir les informations du pixel sélectionné
  const selectedPixelData = selectedPixel 
    ? testData[`${selectedPixel.x}-${selectedPixel.y}`] 
    : null

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold mb-2">🧪 Test Grille Signal Garden</h1>
        <div className="flex gap-4 text-sm">
          <div>Zoom: {zoom}%</div>
          <div>
            Sélection: {selectedPixel ? `(${selectedPixel.x}, ${selectedPixel.y})` : 'Aucune'}
          </div>
          {selectedPixelData && (
            <div>
              Type: {selectedPixelData.dominantType !== undefined ? 
                `Type ${selectedPixelData.dominantType}` : 'Non défini'}
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-2 text-xs text-gray-600">
          💡 Cliquez sur les pixels colorés pour voir le tooltip. Les pixels vides afficheront "Vide".
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <KonvaGrid
          gridData={testData}
          onPixelClick={handlePixelClick}
          zoom={zoom}
          selectedPixel={selectedPixel}
          onZoomChange={handleZoomChange}
        />
      </div>
    </div>
  )
}
