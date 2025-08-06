/**
 * Custom hook for handling offline/online synchronization
 */

import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, success, error
  const [pendingChanges, setPendingChanges] = useState([])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingChanges()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load pending changes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('word_adventure_pending_changes')
    if (saved) {
      try {
        setPendingChanges(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse pending changes:', error)
      }
    }
  }, [])

  // Save pending changes to localStorage
  useEffect(() => {
    localStorage.setItem('word_adventure_pending_changes', JSON.stringify(pendingChanges))
  }, [pendingChanges])

  // Add a change to the pending queue
  const queueChange = useCallback((change) => {
    const changeWithId = {
      ...change,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    }
    
    setPendingChanges(prev => [...prev, changeWithId])
    
    // Try to sync immediately if online
    if (isOnline) {
      syncPendingChanges()
    }
  }, [isOnline])

  // Sync all pending changes
  const syncPendingChanges = useCallback(async () => {
    if (pendingChanges.length === 0 || !isOnline) {
      return
    }

    setSyncStatus('syncing')
    
    try {
      const syncPromises = pendingChanges.map(async (change) => {
        try {
          switch (change.type) {
            case 'word_progress':
              await api.updateUserProgress(change.userId, change.data)
              break
            case 'word_create':
              await api.createWord(change.data)
              break
            case 'word_update':
              await api.updateWord(change.wordId, change.data)
              break
            case 'analytics_event':
              await api.trackEvent(change.data)
              break
            default:
              console.warn('Unknown change type:', change.type)
          }
          return { success: true, id: change.id }
        } catch (error) {
          console.error('Failed to sync change:', change, error)
          return { success: false, id: change.id, error }
        }
      })

      const results = await Promise.allSettled(syncPromises)
      
      // Remove successfully synced changes
      const successfulIds = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value.id)
      
      setPendingChanges(prev => prev.filter(change => !successfulIds.includes(change.id)))
      
      setSyncStatus('success')
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 2000)
      
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus('error')
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }, [pendingChanges, isOnline])

  // Manual sync trigger
  const forcSync = useCallback(() => {
    if (isOnline) {
      syncPendingChanges()
    }
  }, [isOnline, syncPendingChanges])

  // Clear all pending changes (use with caution)
  const clearPendingChanges = useCallback(() => {
    setPendingChanges([])
    localStorage.removeItem('word_adventure_pending_changes')
  }, [])

  return {
    isOnline,
    syncStatus,
    pendingChanges: pendingChanges.length,
    queueChange,
    forcSync,
    clearPendingChanges
  }
}

