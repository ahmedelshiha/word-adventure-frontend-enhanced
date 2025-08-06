import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'

const LoadingState = ({ 
  message = "Loading...", 
  size = "medium", // "small", "medium", "large"
  type = "default" // "default", "page", "inline"
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-20',
          spinner: 'h-6 w-6',
          text: 'text-sm'
        }
      case 'large':
        return {
          container: 'h-64',
          spinner: 'h-16 w-16',
          text: 'text-xl'
        }
      default:
        return {
          container: 'h-40',
          spinner: 'h-10 w-10',
          text: 'text-lg'
        }
    }
  }

  const classes = getSizeClasses()

  const SpinnerComponent = () => (
    <motion.div
      className={`${classes.spinner} border-4 border-purple-200 border-t-purple-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${classes.container}`}>
      <SpinnerComponent />
      <motion.p
        className={`${classes.text} text-purple-600 font-medium`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  )

  if (type === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <LoadingContent />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (type === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center space-x-3 py-4"
      >
        <SpinnerComponent />
        <span className={`${classes.text} text-purple-600`}>{message}</span>
      </motion.div>
    )
  }

  // Default card type
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <LoadingContent />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LoadingState

