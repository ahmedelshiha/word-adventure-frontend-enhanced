/**
 * Offline Indicator Component
 * Shows connection status and sync information
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useOfflineSync } from '../hooks/useOfflineSync'

const OfflineIndicator = () => {
  const { isOnline, syncStatus, pendingChanges, forcSync } = useOfflineSync()

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4" />
    }
    
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Wifi className="w-4 h-4" />
    }
  }

  const getStatusColor = () => {
    if (!isOnline) {
      return 'bg-red-500'
    }
    
    switch (syncStatus) {
      case 'syncing':
        return 'bg-blue-500'
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-orange-500'
      default:
        return pendingChanges > 0 ? 'bg-yellow-500' : 'bg-green-500'
    }
  }

  const getStatusText = () => {
    if (!isOnline) {
      return `Offline${pendingChanges > 0 ? ` • ${pendingChanges} pending` : ''}`
    }
    
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...'
      case 'success':
        return 'Synced'
      case 'error':
        return 'Sync failed'
      default:
        return pendingChanges > 0 ? `${pendingChanges} pending` : 'Online'
    }
  }

  const shouldShow = !isOnline || syncStatus !== 'idle' || pendingChanges > 0

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-40"
        >
          <div
            className={`${getStatusColor()} text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={isOnline && pendingChanges > 0 ? forcSync : undefined}
            title={isOnline && pendingChanges > 0 ? 'Click to sync now' : undefined}
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineIndicator

