/**
 * Virtual Pet Care Component
 * Interactive virtual pet that grows with learning progress
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Sparkles, Gift, Star, Crown, Shirt, 
  Cookie, Gamepad2, Brush, Camera, Music, Book
} from 'lucide-react'
import { useApp } from '../App'

const VirtualPetCare = () => {
  const { virtualPet, setVirtualPet, userStats, addXP } = useApp()
  const [selectedTab, setSelectedTab] = useState('care')
  const [showFeedAnimation, setShowFeedAnimation] = useState(false)
  const [showPlayAnimation, setShowPlayAnimation] = useState(false)

  // Pet happiness decreases over time
  useEffect(() => {
    const interval = setInterval(() => {
      setVirtualPet(prev => {
        const timeSinceLastFed = Date.now() - prev.lastFed
        const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60)
        
        // Decrease happiness by 1 every hour without feeding
        const happinessDecrease = Math.floor(hoursWithoutFood)
        const newHappiness = Math.max(0, prev.happiness - happinessDecrease)
        
        return {
          ...prev,
          happiness: newHappiness
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [setVirtualPet])

  const feedPet = () => {
    setVirtualPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      lastFed: Date.now()
    }))
    addXP(5, 'pet_care')
    setShowFeedAnimation(true)
    setTimeout(() => setShowFeedAnimation(false), 2000)
  }

  const playWithPet = () => {
    setVirtualPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      growth: Math.min(100, prev.growth + 5)
    }))
    addXP(5, 'pet_play')
    setShowPlayAnimation(true)
    setTimeout(() => setShowPlayAnimation(false), 2000)
  }

  const buyAccessory = (accessory) => {
    const cost = accessory.cost
    if (userStats.xp >= cost) {
      setVirtualPet(prev => ({
        ...prev,
        accessories: [...prev.accessories, accessory.id]
      }))
      // In a real app, you'd deduct XP here
      // For demo purposes, we'll just add the accessory
    }
  }

  const changePetType = (newType) => {
    setVirtualPet(prev => ({
      ...prev,
      type: newType
    }))
  }

  const getPetEmoji = () => {
    const { type, happiness, growth } = virtualPet
    
    if (happiness < 30) {
      return type === 'cat' ? '😿' : type === 'dog' ? '😢' : '😔'
    } else if (happiness > 80) {
      return type === 'cat' ? '😸' : type === 'dog' ? '😄' : '😊'
    } else {
      return type === 'cat' ? '😺' : type === 'dog' ? '🐕' : '🐰'
    }
  }

  const getGrowthStage = () => {
    if (virtualPet.growth < 25) return 'Baby'
    if (virtualPet.growth < 50) return 'Young'
    if (virtualPet.growth < 75) return 'Adult'
    return 'Elder'
  }

  const accessories = [
    { id: 'hat', name: 'Party Hat', icon: '🎩', cost: 50 },
    { id: 'bow', name: 'Bow Tie', icon: '🎀', cost: 30 },
    { id: 'glasses', name: 'Cool Glasses', icon: '🕶️', cost: 40 },
    { id: 'crown', name: 'Royal Crown', icon: '👑', cost: 100 },
    { id: 'scarf', name: 'Cozy Scarf', icon: '🧣', cost: 35 },
    { id: 'medal', name: 'Gold Medal', icon: '🏅', cost: 75 }
  ]

  const petTypes = [
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dog', name: 'Dog', emoji: '🐶' },
    { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
    { id: 'hamster', name: 'Hamster', emoji: '🐹' },
    { id: 'bird', name: 'Bird', emoji: '🐦' },
    { id: 'fish', name: 'Fish', emoji: '🐠' }
  ]

  const activities = [
    { id: 'feed', name: 'Feed', icon: Cookie, action: feedPet, cooldown: 30 },
    { id: 'play', name: 'Play', icon: Gamepad2, action: playWithPet, cooldown: 15 },
    { id: 'brush', name: 'Brush', icon: Brush, action: () => {}, cooldown: 60 },
    { id: 'photo', name: 'Photo', icon: Camera, action: () => {}, cooldown: 0 }
  ]

  const StatBar = ({ label, value, max = 100, color = 'purple' }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-3 rounded-full`}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pet Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 text-center relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-4xl">⭐</div>
          <div className="absolute top-8 right-8 text-3xl">✨</div>
          <div className="absolute bottom-4 left-8 text-3xl">🌟</div>
          <div className="absolute bottom-8 right-4 text-4xl">💫</div>
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ 
              scale: showFeedAnimation || showPlayAnimation ? [1, 1.2, 1] : 1,
              rotate: showPlayAnimation ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 0.5 }}
            className="text-8xl mb-4"
          >
            {getPetEmoji()}
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{virtualPet.name}</h2>
          <p className="text-gray-600 mb-4">{getGrowthStage()} {virtualPet.type}</p>

          {/* Pet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <StatBar label="Happiness" value={virtualPet.happiness} color="pink" />
            <StatBar label="Growth" value={virtualPet.growth} color="green" />
          </div>

          {/* Accessories Display */}
          {virtualPet.accessories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Wearing:</p>
              <div className="flex justify-center space-x-2">
                {virtualPet.accessories.map(accessoryId => {
                  const accessory = accessories.find(a => a.id === accessoryId)
                  return accessory ? (
                    <span key={accessoryId} className="text-2xl" title={accessory.name}>
                      {accessory.icon}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Animation Effects */}
          <AnimatePresence>
            {showFeedAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -50 }}
                exit={{ opacity: 0, y: -100 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
              >
                ❤️
              </motion.div>
            )}
            {showPlayAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
              >
                ⭐
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'care', name: 'Care', icon: Heart },
          { id: 'customize', name: 'Customize', icon: Shirt },
          { id: 'shop', name: 'Shop', icon: Gift }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTab === 'care' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Care Activities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activities.map((activity) => (
                <motion.button
                  key={activity.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={activity.action}
                  className="flex flex-col items-center space-y-2 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <activity.icon className="w-8 h-8 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">{activity.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Care Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Care Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Feed your pet regularly to keep happiness high</li>
                <li>• Play with your pet to help it grow</li>
                <li>• Complete learning activities to earn XP for accessories</li>
                <li>• Happy pets give you bonus XP when learning!</li>
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'customize' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Pet</h3>
            
            {/* Pet Type Selection */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Pet Type</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {petTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changePetType(type.id)}
                    className={`flex flex-col items-center space-y-2 p-3 border rounded-lg transition-colors ${
                      virtualPet.type === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <span className="text-xs font-medium text-gray-700">{type.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Name Change */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pet Name</h4>
              <input
                type="text"
                value={virtualPet.name}
                onChange={(e) => setVirtualPet(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter pet name"
              />
            </div>
          </div>
        )}

        {selectedTab === 'shop' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Accessory Shop</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{userStats.xp} XP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accessories.map((accessory) => {
                const owned = virtualPet.accessories.includes(accessory.id)
                const canAfford = userStats.xp >= accessory.cost

                return (
                  <motion.div
                    key={accessory.id}
                    whileHover={{ scale: 1.02 }}
                    className={`border rounded-lg p-4 text-center transition-colors ${
                      owned 
                        ? 'border-green-300 bg-green-50' 
                        : canAfford 
                          ? 'border-gray-200 hover:border-purple-300' 
                          : 'border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{accessory.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{accessory.name}</h4>
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 mb-3">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{accessory.cost} XP</span>
                    </div>
                    
                    {owned ? (
                      <span className="text-xs text-green-600 font-medium">Owned</span>
                    ) : (
                      <button
                        onClick={() => buyAccessory(accessory)}
                        disabled={!canAfford}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                          canAfford
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">🎯 Earn More XP</h4>
              <p className="text-sm text-yellow-800">
                Complete learning activities, take quizzes, and maintain your learning streak to earn XP for accessories!
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default VirtualPetCare

