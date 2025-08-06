import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { 
  AlertCircle, 
  CheckCircle, 
  X 
} from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // "default", "success", "warning", "danger"
  icon = null
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          headerBg: 'from-green-500 to-emerald-500',
          icon: icon || <CheckCircle className="h-6 w-6" />,
          confirmBg: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        }
      case 'warning':
        return {
          headerBg: 'from-yellow-500 to-orange-500',
          icon: icon || <AlertCircle className="h-6 w-6" />,
          confirmBg: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        }
      case 'danger':
        return {
          headerBg: 'from-red-500 to-pink-500',
          icon: icon || <AlertCircle className="h-6 w-6" />,
          confirmBg: 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        }
      default:
        return {
          headerBg: 'from-purple-500 to-blue-500',
          icon: icon || <AlertCircle className="h-6 w-6" />,
          confirmBg: 'from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className={`bg-gradient-to-r ${styles.headerBg} text-white`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center">
                {styles.icon}
                <span className="ml-2">{title}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700 text-lg">{message}</p>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className={`flex-1 bg-gradient-to-r ${styles.confirmBg} text-white`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default ConfirmationModal

