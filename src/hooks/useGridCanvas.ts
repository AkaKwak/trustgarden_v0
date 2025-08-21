import { useState, useEffect, useCallback, useRef } from 'react'
import { GridPosition, GridConfig } from '../components/grid/types'
import { DEFAULT_GRID_CONFIG, calculatePixelSize } from '../components/grid/constants'

interface UseGridCanvasOptions {
  config?: Partial<GridConfig>
  onPixelClick?: (x: number, y: number) => void
  onZoomChange?: (zoom: number) => void
}

export function useGridCanvas(options: UseGridCanvasOptions = {}) {
  const config = { ...DEFAULT_GRID_CONFIG, ...options.config }
  const containerRef = useRef<HTMLDivElement>(null)
  
  // État de la grille
  const [zoom, setZoom] = useState(config.defaultZoom)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pixelSize, setPixelSize] = useState(20)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Calcul de la taille des pixels
  const updatePixelSize = useCallback(() => {
    const screenWidth = window.innerWidth
    const newPixelSize = calculatePixelSize(screenWidth, zoom)
    setPixelSize(newPixelSize)
  }, [zoom])

  // Gestion du zoom
  const handleZoom = useCallback((newZoom: number) => {
    // Le zoom minimum est 0.5 (vue complète), maximum 3
    const clampedZoom = Math.max(0.5, Math.min(3, newZoom))
    setZoom(clampedZoom)
    if (options.onZoomChange) {
      options.onZoomChange(clampedZoom)
    }
  }, [options.onZoomChange])

  const zoomIn = useCallback(() => {
    handleZoom(zoom + config.zoomStep)
  }, [zoom, config.zoomStep, handleZoom])

  const zoomOut = useCallback(() => {
    handleZoom(zoom - config.zoomStep)
  }, [zoom, config.zoomStep, handleZoom])

  // Gestion du pan
  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setPan(prev => ({
      x: prev.x + deltaX * config.panSensitivity,
      y: prev.y + deltaY * config.panSensitivity,
    }))
  }, [config.panSensitivity])

  // Gestion des événements de souris
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Clic gauche
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      
      // Seulement pan si le mouvement est suffisant (éviter les micro-mouvements)
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        handlePan(deltaX, deltaY)
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }
  }, [isDragging, dragStart, handlePan])

  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsDragging(false)
  }, [])

  // Gestion du scroll pour le zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const zoomDelta = e.deltaY > 0 ? -config.zoomStep : config.zoomStep
    const newZoom = zoom + zoomDelta
    handleZoom(newZoom)
  }, [zoom, config.zoomStep, handleZoom])

  // Mise à jour de la taille des pixels
  useEffect(() => {
    updatePixelSize()
  }, [updatePixelSize])

  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => updatePixelSize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updatePixelSize])

  // Calcul des dimensions de la grille
  const gridSize = config.size * pixelSize
  const maxPanX = Math.max(0, gridSize - (window.innerWidth * 2/3 - 80))
  const maxPanY = Math.max(0, gridSize - (window.innerHeight - 160))

  // Limitation du pan
  const limitedPan = {
    x: Math.max(-maxPanX, Math.min(0, pan.x)),
    y: Math.max(-maxPanY, Math.min(0, pan.y)),
  }

  return {
    // État
    zoom,
    pan: limitedPan,
    pixelSize,
    gridSize,
    isDragging,
    
    // Actions
    setZoom: handleZoom,
    setPan,
    zoomIn,
    zoomOut,
    
    // Événements
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    
    // Refs
    containerRef,
  }
}
