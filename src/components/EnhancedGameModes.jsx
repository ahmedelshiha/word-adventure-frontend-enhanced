/**
 * Enhanced Game Modes Component
 * Multiple interactive learning game modes for varied engagement
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Clock, Target, Shuffle, Brain, Star, 
  Trophy, Play, Pause, RotateCcw, CheckCircle,
  X, Heart, Timer, Award, Gamepad2
} from 'lucide-react'
import { useApp } from '../App'

const EnhancedGameModes = () => {
  const { words, addXP, updateWordStatus, addTestResult } = useApp()
  const [selectedMode, setSelectedMode] = useState(null)
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, finished
  const [currentWord, setCurrentWord] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [gameWords, setGameWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResult, setShowResult] = useState(null)

  const gameModes = [
    {
      id: 'speed_challenge',
      name: 'Speed Challenge',
      description: 'Answer as many words as possible in 60 seconds',
      icon: Zap,
      color: 'yellow',
      duration: 60,
      lives: null,
      difficulty: 'Medium'
    },
    {
      id: 'survival_mode',
      name: 'Survival Mode',
      description: 'Keep going until you make 3 mistakes',
      icon: Heart,
      color: 'red',
      duration: null,
      lives: 3,
      difficulty: 'Hard'
    },
    {
      id: 'precision_test',
      name: 'Precision Test',
      description: 'Get 10 words correct with perfect accuracy',
      icon: Target,
      color: 'blue',
      duration: null,
      lives: null,
      difficulty: 'Expert'
    },
    {
      id: 'memory_match',
      name: 'Memory Match',
      description: 'Match words with their images from memory',
      icon: Brain,
      color: 'purple',
      duration: 90,
      lives: 5,
      difficulty: 'Medium'
    },
    {
      id: 'word_rush',
      name: 'Word Rush',
      description: 'Quick-fire word identification',
      icon: Timer,
      color: 'green',
      duration: 45,
      lives: null,
      difficulty: 'Easy'
    },
    {
      id: 'master_challenge',
      name: 'Master Challenge',
      description: 'The ultimate test of your vocabulary',
      icon: Trophy,
      color: 'gold',
      duration: 120,
      lives: 1,
      difficulty: 'Master'
    }
  ]

  // Timer effect
  useEffect(() => {
    let interval = null
    if (gameState === 'playing' && timeLeft > 0 && selectedMode?.duration) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            endGame()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft, selectedMode])

  const startGame = (mode) => {
    setSelectedMode(mode)
    setGameState('playing')
    setScore(0)
    setStreak(0)
    setLives(mode.lives || 3)
    setTimeLeft(mode.duration || 0)
    setCurrentIndex(0)
    
    // Shuffle words for the game
    const shuffledWords = [...words].sort(() => Math.random() - 0.5)
    setGameWords(shuffledWords)
    setCurrentWord(shuffledWords[0])
  }

  const nextWord = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < gameWords.length) {
      setCurrentIndex(nextIndex)
      setCurrentWord(gameWords[nextIndex])
    } else {
      // Reshuffle if we run out of words
      const shuffledWords = [...words].sort(() => Math.random() - 0.5)
      setGameWords(shuffledWords)
      setCurrentIndex(0)
      setCurrentWord(shuffledWords[0])
    }
  }

  const handleAnswer = (correct) => {
    setShowResult(correct ? 'correct' : 'incorrect')
    
    if (correct) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
      addXP(10, 'game_correct')
      updateWordStatus(currentWord.id, true)
      addTestResult(currentWord.id, true)
    } else {
      setStreak(0)
      if (selectedMode.lives) {
        setLives(prev => {
          const newLives = prev - 1
          if (newLives <= 0) {
            endGame()
          }
          return newLives
        })
      }
      addTestResult(currentWord.id, false)
    }

    // Check win conditions
    if (selectedMode.id === 'precision_test' && correct && score + 1 >= 10) {
      endGame()
      return
    }

    setTimeout(() => {
      setShowResult(null)
      nextWord()
    }, 1500)
  }

  const endGame = () => {
    setGameState('finished')
    
    // Calculate bonus XP based on performance
    let bonusXP = score * 5
    if (streak >= 5) bonusXP += 50
    if (streak >= 10) bonusXP += 100
    
    addXP(bonusXP, 'game_completion')
  }

  const resetGame = () => {
    setSelectedMode(null)
    setGameState('menu')
    setCurrentWord(null)
    setScore(0)
    setTimeLeft(0)
    setLives(3)
    setStreak(0)
    setCurrentIndex(0)
    setShowResult(null)
  }

  const pauseGame = () => {
    setGameState('paused')
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-orange-600 bg-orange-100'
      case 'Expert': return 'text-red-600 bg-red-100'
      case 'Master': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (gameState === 'menu') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Modes</h1>
          <p className="text-gray-600">Choose your challenge and test your vocabulary skills!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode) => (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => startGame(mode)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${mode.color}-100`}>
                  <mode.icon className={`w-6 h-6 text-${mode.color}-600`} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mode.difficulty)}`}>
                  {mode.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{mode.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{mode.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  {mode.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{mode.duration}s</span>
                    </div>
                  )}
                  {mode.lives && (
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{mode.lives} lives</span>
                    </div>
                  )}
                </div>
                <Play className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (gameState === 'playing' || gameState === 'paused') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{selectedMode.name}</h2>
            <div className="flex items-center space-x-4">
              {gameState === 'playing' ? (
                <button
                  onClick={pauseGame}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={resumeGame}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={resetGame}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-600">Streak</div>
            </div>
            {selectedMode.duration && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-600">Time Left</div>
              </div>
            )}
            {selectedMode.lives && (
              <div className="text-center">
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: selectedMode.lives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-6 h-6 ${
                        i < lives ? 'text-red-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lives</div>
              </div>
            )}
          </div>
        </div>

        {/* Game Content */}
        {gameState === 'paused' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Pause className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Game Paused</h3>
            <p className="text-gray-600 mb-6">Take a break and resume when you're ready!</p>
            <button
              onClick={resumeGame}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Resume Game
            </button>
          </motion.div>
        ) : currentWord ? (
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
          >
            {/* Word Display */}
            <div className="mb-8">
              <img
                src={currentWord.image}
                alt={currentWord.word}
                className="w-48 h-48 object-cover rounded-lg mx-auto mb-6 shadow-md"
              />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{currentWord.word}</h3>
              {currentWord.pronunciation && (
                <p className="text-gray-600 text-lg">{currentWord.pronunciation}</p>
              )}
            </div>

            {/* Answer Buttons */}
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(false)}
                className="flex items-center px-8 py-4 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Don't Know
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(true)}
                className="flex items-center px-8 py-4 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I Know This!
              </motion.button>
            </div>

            {/* Result Animation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className={`absolute inset-0 flex items-center justify-center ${
                    showResult === 'correct' ? 'bg-green-500' : 'bg-red-500'
                  } bg-opacity-90 text-white`}
                >
                  <div className="text-center">
                    {showResult === 'correct' ? (
                      <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    ) : (
                      <X className="w-16 h-16 mx-auto mb-4" />
                    )}
                    <h3 className="text-2xl font-bold">
                      {showResult === 'correct' ? 'Correct!' : 'Try Again!'}
                    </h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </div>
    )
  }

  if (gameState === 'finished') {
    const getPerformanceMessage = () => {
      if (score >= 20) return { message: "Outstanding!", emoji: "🏆", color: "text-yellow-600" }
      if (score >= 15) return { message: "Excellent!", emoji: "⭐", color: "text-purple-600" }
      if (score >= 10) return { message: "Great job!", emoji: "🎉", color: "text-green-600" }
      if (score >= 5) return { message: "Good effort!", emoji: "👍", color: "text-blue-600" }
      return { message: "Keep practicing!", emoji: "💪", color: "text-orange-600" }
    }

    const performance = getPerformanceMessage()

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h2 className={`text-3xl font-bold mb-2 ${performance.color}`}>
            {performance.message}
          </h2>
          <p className="text-gray-600 mb-8">You completed {selectedMode.name}!</p>

          {/* Results */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-purple-700">Words Correct</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-orange-700">Best Streak</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Back to Menu
            </button>
            <button
              onClick={() => startGame(selectedMode)}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}

export default EnhancedGameModes

