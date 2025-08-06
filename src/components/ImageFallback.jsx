import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

const ImageFallback = ({ 
  src, 
  alt, 
  fallbackSrc = null,
  fallbackEmoji = '❓',
  className = '',
  onError = null,
  showRetry = false
}) => {
  const [imageError, setImageError] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      if (onError) {
        onError()
      }
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setImageError(false)
    setCurrentSrc(src + '?retry=' + Date.now()) // Add cache buster
    
    setTimeout(() => {
      setIsRetrying(false)
    }, 1000)
  }

  if (imageError && !isRetrying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-500 rounded-lg overflow-hidden`}
      >
        {fallbackSrc ? (
          <img 
            src={fallbackSrc} 
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => {
              // If fallback image also fails, show emoji
              setImageError(true)
            }}
          />
        ) : (
          <>
            <div className="text-4xl mb-2">{fallbackEmoji}</div>
            <div className="text-xs text-center px-2">
              <AlertCircle className="h-3 w-3 mx-auto mb-1" />
              <span>Image not available</span>
            </div>
            {showRetry && (
              <Button
                onClick={handleRetry}
                variant="ghost"
                size="sm"
                className="mt-2 h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </>
        )}
      </motion.div>
    )
  }

  if (isRetrying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${className} bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg overflow-hidden`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-6 w-6 text-purple-500" />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  )
}

export default ImageFallback

