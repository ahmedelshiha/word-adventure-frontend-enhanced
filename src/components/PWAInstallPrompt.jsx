/**
 * PWA Install Prompt Component
 * Shows a prompt to install the app when PWA criteria are met
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = window.navigator.standalone === true
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e)
      
      // Check if user has previously dismissed the prompt
      const dismissed = localStorage.getItem('pwa_install_dismissed')
      const dismissedTime = dismissed ? parseInt(dismissed) : 0
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      
      // Show prompt if not dismissed or if it's been more than 7 days
      if (!dismissed || daysSinceDismissed > 7) {
        // Delay showing the prompt to avoid interrupting user flow
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      
      // Track installation event
      if (window.gtag) {
        window.gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: 'App Installed'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      // Track acceptance
      if (window.gtag) {
        window.gtag('event', 'pwa_install_accepted', {
          event_category: 'PWA',
          event_label: 'Install Accepted'
        })
      }
    } else {
      console.log('User dismissed the install prompt')
      // Track dismissal
      if (window.gtag) {
        window.gtag('event', 'pwa_install_dismissed', {
          event_category: 'PWA',
          event_label: 'Install Dismissed'
        })
      }
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa_install_dismissed', Date.now().toString())
    
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'PWA',
        event_label: 'Prompt Dismissed'
      })
    }
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  Install Word Adventure
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add to your home screen for quick access and offline learning!
                </p>
                
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    Not now
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PWAInstallPrompt

