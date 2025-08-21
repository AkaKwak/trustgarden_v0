import { ReactNode } from 'react'

interface ScrollContainerProps {
  children: ReactNode
  className?: string
  maxHeight?: string
}

export function ScrollContainer({ children, className = '', maxHeight = '100%' }: ScrollContainerProps) {
  return (
    <div 
      className={`overflow-y-auto scrollbar-hide ${className}`}
      style={{ 
        maxHeight,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {children}
    </div>
  )
}
