// Updated: Enhanced with category support and 200-word dataset
import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { wordsDatabase, enhancedCategories } from './data/wordsDatabase'
import LoginPage from './components/LoginPage'
import Dashboard from './components/EnhancedDashboard'
import WordLibrary from './components/EnhancedWordLibrary'
import WordTesting from './components/WordTesting'
import Results from './components/Results'
import ProgressDashboard from './components/ProgressDashboard'
import ParentSettings from './components/ParentSettings'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import api from './services/api'
import { useOfflineSync } from './hooks/useOfflineSync'
import './App.css'

// Authentication Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// App Context for global state
const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState(wordsDatabase)
  const [categories, setCategories] = useState(enhancedCategories)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [testResults, setTestResults] = useState([])
  const [isTestMode, setIsTestMode] = useState(false)
  const [selectedQuizCategories, setSelectedQuizCategories] = useState([])
  
  // Enhanced gamification state
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayDate: null,
    achievements: [],
    totalWordsLearned: 0,
    totalQuizzesTaken: 0,
    perfectScores: 0
  })
  
  // Virtual pet state
  const [virtualPet, setVirtualPet] = useState({
    name: 'Buddy',
    type: 'cat',
    happiness: 100,
    growth: 0,
    accessories: [],
    lastFed: Date.now()
  })

  // Offline sync hook
  const { queueChange } = useOfflineSync()

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  // Check for existing session on app load
  useEffect(() => {
    const initializeApp = async () => {
      // Check for saved user
      const savedUser = localStorage.getItem('word_adventure_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('word_adventure_user')
        }
      }
      
      // Try to load words from API first, fallback to local
      try {
        const apiWords = await api.getWords()
        if (apiWords && apiWords.length > 0) {
          setWords(apiWords)
        } else {
          // Load saved words progress from localStorage
          const savedWords = localStorage.getItem('word_adventure_words')
          if (savedWords) {
            try {
              const parsedWords = JSON.parse(savedWords)
              // Merge with new database, preserving progress
              const mergedWords = wordsDatabase.map(word => {
                const savedWord = parsedWords.find(sw => sw.id === word.id)
                return savedWord ? { ...word, known: savedWord.known } : word
              })
              setWords(mergedWords)
            } catch (error) {
              console.error('Error parsing saved words:', error)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load words from API, using local data')
      }
      
      // Try to load categories from API
      try {
        const apiCategories = await api.getCategories()
        if (apiCategories && apiCategories.length > 0) {
          // Check if we got proper category objects with required fields
          const validCategories = apiCategories.filter(cat => cat.id && cat.name && cat.emoji)
          if (validCategories.length > 0) {
            setCategories(validCategories)
            console.log('Loaded categories from API:', validCategories.length)
          } else {
            throw new Error('Invalid category format from API')
          }
        } else {
          throw new Error('No categories returned from API')
        }
      } catch (error) {
        console.warn('Failed to load categories from API, using local data:', error.message)
        // Use enhanced categories as fallback
        setCategories(enhancedCategories)

        // Also try localStorage fallback
        const savedCategories = localStorage.getItem('word_adventure_categories')
        if (savedCategories) {
          try {
            const parsedCategories = JSON.parse(savedCategories)
            // Merge with enhanced categories
            const mergedCategories = [...enhancedCategories, ...parsedCategories.filter(cat =>
              !enhancedCategories.some(ec => ec.id === cat.id)
            )]
            setCategories(mergedCategories)
          } catch (error) {
            console.error('Error parsing saved categories:', error)
          }
        }
      }
      
      // Load other saved data
      const savedTestResults = localStorage.getItem('word_adventure_test_results')
      if (savedTestResults) {
        try {
          setTestResults(JSON.parse(savedTestResults))
        } catch (error) {
          console.error('Error parsing saved test results:', error)
        }
      }
      
      const savedStats = localStorage.getItem('word_adventure_stats')
      if (savedStats) {
        try {
          setUserStats(JSON.parse(savedStats))
        } catch (error) {
          console.error('Error parsing saved stats:', error)
        }
      }
      
      const savedPet = localStorage.getItem('word_adventure_pet')
      if (savedPet) {
        try {
          setVirtualPet(JSON.parse(savedPet))
        } catch (error) {
          console.error('Error parsing saved pet:', error)
        }
      }
      
      setLoading(false)
    }

    initializeApp()
  }, [])

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('word_adventure_words', JSON.stringify(words))
  }, [words])

  useEffect(() => {
    localStorage.setItem('word_adventure_test_results', JSON.stringify(testResults))
  }, [testResults])

  useEffect(() => {
    localStorage.setItem('word_adventure_categories', JSON.stringify(categories))
  }, [categories])
  
  useEffect(() => {
    localStorage.setItem('word_adventure_stats', JSON.stringify(userStats))
  }, [userStats])
  
  useEffect(() => {
    localStorage.setItem('word_adventure_pet', JSON.stringify(virtualPet))
  }, [virtualPet])

  // Gamification functions
  const addXP = (amount, reason = 'general') => {
    setUserStats(prev => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / 100) + 1
      const leveledUp = newLevel > prev.level
      
      if (leveledUp) {
        // Feed virtual pet when leveling up
        setVirtualPet(prevPet => ({
          ...prevPet,
          happiness: Math.min(100, prevPet.happiness + 20),
          growth: Math.min(100, prevPet.growth + 10)
        }))
      }
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      }
    })
  }

  const updateStreak = () => {
    const today = new Date().toDateString()
    setUserStats(prev => {
      const lastPlay = prev.lastPlayDate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = prev.streak
      if (lastPlay === yesterday.toDateString()) {
        newStreak += 1
      } else if (lastPlay !== today) {
        newStreak = 1
      }
      
      return {
        ...prev,
        streak: newStreak,
        lastPlayDate: today
      }
    })
  }

  const unlockAchievement = (achievementId) => {
    setUserStats(prev => {
      if (prev.achievements.includes(achievementId)) {
        return prev
      }
      
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId]
      }
    })
  }

  const register = async (userData) => {
    try {
      const result = await api.register(userData)
      
      if (result.user) {
        setUser(result.user)
        localStorage.setItem('word_adventure_user', JSON.stringify(result.user))
        
        // Initialize user stats and virtual pet from API response
        if (result.user.virtual_pet) {
          setVirtualPet(result.user.virtual_pet)
        }
        
        if (result.user.settings) {
          // Apply user settings if needed
        }
        
        // Track registration event
        queueChange({
          type: 'analytics_event',
          data: {
            event: 'user_registration',
            userId: result.user.id,
            timestamp: Date.now()
          }
        })
        
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const login = async (username, password) => {
    try {
      const result = await api.login({ username, password })
      
      if (result.success || result.user) {
        const userData = result.user || {
          id: 1,
          username: username,
          email: `${username}@wordadventure.com`,
          avatar: '👤',
          level: 1,
          points: 0,
          isDemo: result.user?.isDemo || false
        }
        
        setUser(userData)
        localStorage.setItem('word_adventure_user', JSON.stringify(userData))
        
        // Update user stats and virtual pet from API response
        if (userData.virtual_pet) {
          setVirtualPet(userData.virtual_pet)
        }
        
        if (userData.xp !== undefined) {
          setUserStats(prev => ({
            ...prev,
            xp: userData.xp,
            level: userData.level || 1,
            streak: userData.current_streak || 0,
            totalWordsLearned: userData.words_learned || 0,
            totalQuizzesTaken: userData.total_tests_taken || 0
          }))
        }
        
        // Track login event
        queueChange({
          type: 'analytics_event',
          data: {
            event: 'user_login',
            userId: userData.id,
            timestamp: Date.now()
          }
        })
        
        return { success: true }
      } else {
        return { success: false, error: result.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.warn('API logout failed:', error)
    } finally {
      localStorage.removeItem('word_adventure_user')
      setUser(null)
      setTestResults([])
      setCurrentWordIndex(0)
      setIsTestMode(false)
    }
  }

  const updateWordStatus = (wordId, known) => {
    setWords(prevWords => {
      const updatedWords = prevWords.map(word => 
        word.id === wordId ? { ...word, known } : word
      )
      
      // Add XP and update stats when learning a new word
      if (known) {
        const word = prevWords.find(w => w.id === wordId)
        if (word && !word.known) {
          addXP(10, 'word_learned')
          updateStreak()
          setUserStats(prev => ({
            ...prev,
            totalWordsLearned: prev.totalWordsLearned + 1
          }))
          
          // Check for achievements
          const totalLearned = updatedWords.filter(w => w.known).length
          if (totalLearned === 1) unlockAchievement('first_word')
          if (totalLearned === 10) unlockAchievement('word_explorer')
          if (totalLearned === 50) unlockAchievement('vocabulary_master')
        }
      }
      
      return updatedWords
    })
  }

  const addTestResult = (wordId, remembered) => {
    setTestResults(prev => [...prev, { wordId, remembered, timestamp: Date.now() }])
    
    // Add XP for taking quiz
    addXP(5, 'quiz_attempt')
    if (remembered) {
      addXP(10, 'correct_answer')
    }
    
    setUserStats(prev => ({
      ...prev,
      totalQuizzesTaken: prev.totalQuizzesTaken + 1
    }))
  }

  const resetTest = () => {
    setTestResults([])
    setCurrentWordIndex(0)
    setIsTestMode(false)
  }

  const addCategory = (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: `custom_${Date.now()}`
    }
    setCategories(prev => [...prev, categoryWithId])
    return categoryWithId
  }

  const updateCategory = (categoryId, updatedCategory) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      )
    )
  }

  const deleteCategory = (categoryId) => {
    // Don't allow deleting default categories
    const isDefault = enhancedCategories.some(cat => cat.id === categoryId)
    if (isDefault) return

    // Remove category from words first
    setWords(prev =>
      prev.map(word =>
        word.category === categoryId ? { ...word, category: 'objects' } : word
      )
    )

    // Remove category
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const getFilteredWordsForQuiz = () => {
    if (selectedQuizCategories.length === 0) {
      return words
    }
    return words.filter(word => selectedQuizCategories.includes(word.category))
  }

  // Virtual pet functions
  const feedPet = () => {
    setVirtualPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      lastFed: Date.now()
    }))
    addXP(5, 'pet_care')
  }

  const playWithPet = () => {
    setVirtualPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      growth: Math.min(100, prev.growth + 5)
    }))
    addXP(5, 'pet_play')
  }

  const authValue = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  const appValue = {
    words,
    setWords,
    categories,
    setCategories,
    currentWordIndex,
    setCurrentWordIndex,
    testResults,
    setTestResults,
    isTestMode,
    setIsTestMode,
    selectedQuizCategories,
    setSelectedQuizCategories,
    userStats,
    setUserStats,
    virtualPet,
    setVirtualPet,
    updateWordStatus,
    addTestResult,
    resetTest,
    addCategory,
    updateCategory,
    deleteCategory,
    getFilteredWordsForQuiz,
    addXP,
    updateStreak,
    unlockAchievement,
    feedPet,
    playWithPet
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={authValue}>
      <AppContext.Provider value={appValue}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            <OfflineIndicator />
            <PWAInstallPrompt />
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/login" 
                  element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
                />
                <Route 
                  path="/*" 
                  element={user ? <AuthenticatedApp /> : <Navigate to="/login" replace />} 
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AppContext.Provider>
    </AuthContext.Provider>
  )
}

function AuthenticatedApp() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<WordLibrary />} />
          <Route path="/test" element={<WordTesting />} />
          <Route path="/results" element={<Results />} />
          <Route path="/progress" element={<ProgressDashboard />} />
          <Route path="/settings" element={<ParentSettings />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
