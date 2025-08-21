import { useState, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    setCoords({ x: e.clientX, y: e.clientY })
    setTimeout(() => setIsVisible(true), delay)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const getPositionStyles = () => {
    const base = 'absolute z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg pointer-events-none transition-all duration-200'
    
    switch (position) {
      case 'top': return `${base} -translate-x-1/2 -translate-y-full -top-2`
      case 'bottom': return `${base} -translate-x-1/2 translate-y-full top-2`
      case 'left': return `${base} -translate-x-full -translate-y-1/2 -left-2`
      case 'right': return `${base} translate-x-full -translate-y-1/2 -right-2`
      default: return base
    }
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          className={`${getPositionStyles()} ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            left: coords.x,
            top: coords.y
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
