import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const SwipeableCard = ({ 
  children, 
  onSwipeLeft = null, 
  onSwipeRight = null,
  swipeThreshold = 100,
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event, info) => {
    setIsDragging(false)
    
    if (disabled) return

    const swipeDistance = info.offset.x
    
    if (swipeDistance > swipeThreshold && onSwipeRight) {
      onSwipeRight()
    } else if (swipeDistance < -swipeThreshold && onSwipeLeft) {
      onSwipeLeft()
    }
    
    // Reset position
    x.set(0)
  }

  return (
    <motion.div
      className={`${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${disabled ? 'cursor-default' : ''}`}
      style={{ 
        x, 
        rotate, 
        opacity,
        touchAction: disabled ? 'auto' : 'none'
      }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      
      {/* Swipe Indicators */}
      {!disabled && (
        <>
          {/* Left swipe indicator */}
          <motion.div
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none"
            style={{
              opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0])
            }}
          >
            ← Swipe
          </motion.div>
          
          {/* Right swipe indicator */}
          <motion.div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none"
            style={{
              opacity: useTransform(x, [0, 50, 100], [0, 0.5, 1])
            }}
          >
            Swipe →
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default SwipeableCard
