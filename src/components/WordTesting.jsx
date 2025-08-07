import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useApp } from '../App'
import ImageFallback from './ImageFallback'
import {
  Volume2,
  Check,
  X,
  Brain,
  ArrowRight,
  RotateCcw,
  Home,
  HelpCircle,
  Filter
} from 'lucide-react'

const WordTesting = () => {
  const navigate = useNavigate()
  const {
    words,
    categories,
    currentWordIndex,
    setCurrentWordIndex,
    testResults,
    addTestResult,
    resetTest,
    setIsTestMode,
    selectedQuizCategories,
    setSelectedQuizCategories,
    getFilteredWordsForQuiz
  } = useApp()
  
  const [currentWord, setCurrentWord] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [lastAnswer, setLastAnswer] = useState(null)
  const [testStarted, setTestStarted] = useState(false)
  const [showCategorySelection, setShowCategorySelection] = useState(false)

  const quizWords = getFilteredWordsForQuiz()

  useEffect(() => {
    setIsTestMode(true)
    // Clear selected categories when component mounts to start fresh
    setSelectedQuizCategories([])

    return () => {
      setIsTestMode(false)
    }
  }, [setIsTestMode, setSelectedQuizCategories])

  useEffect(() => {
    if (quizWords.length > 0 && currentWordIndex < quizWords.length) {
      setCurrentWord(quizWords[currentWordIndex])
    }
  }, [quizWords, currentWordIndex])

  const progress = quizWords.length > 0 ? ((currentWordIndex + 1) / quizWords.length) * 100 : 0

  const speakWord = () => {
    if ('speechSynthesis' in window && currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswer = (remembered) => {
    if (!currentWord) return

    addTestResult(currentWord.id, remembered)
    setLastAnswer(remembered)
    setShowResult(true)

    // Auto advance after showing result
    setTimeout(() => {
      setShowResult(false)
      setLastAnswer(null)
      
      if (currentWordIndex < quizWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        // Test completed
        navigate('/results')
      }
    }, 1500)
  }

  const startTest = () => {
    resetTest()
    setCurrentWordIndex(0)
    setTestStarted(true)
  }

  const restartTest = () => {
    resetTest()
    setCurrentWordIndex(0)
    setShowResult(false)
    setLastAnswer(null)
  }

  const goHome = () => {
    navigate('/')
  }

  const handleCategoryToggle = (categoryId) => {
    setSelectedQuizCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const startQuizWithCategories = () => {
    setShowCategorySelection(false)
    startTest()
  }

  if (!testStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                className="text-8xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧠
              </motion.div>
              <CardTitle className="text-3xl font-bold text-purple-800">
                Quiz Time!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-purple-600">
                  Ready to test your word knowledge?
                </p>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-700">
                    📝 You'll see {quizWords.length} words<br/>
                    🎯 Mark if you remember each one<br/>
                    🏆 Get your results at the end
                  </p>
                  {selectedQuizCategories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-purple-200">
                      <p className="text-xs text-purple-600 mb-1">Selected categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedQuizCategories.map(categoryId => {
                          const category = categories.find(cat => cat.id === categoryId)
                          return category ? (
                            <span key={categoryId} className={`inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${category.color} text-white`}>
                              <span className="mr-1">{category.emoji}</span>
                              {category.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    console.log('Category selection button clicked')
                    setShowCategorySelection(true)
                  }}
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold btn-fun border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Choose Categories ({selectedQuizCategories.length > 0 ? selectedQuizCategories.length + ' selected' : 'All'})
                </Button>

                <Button
                  onClick={startTest}
                  disabled={quizWords.length === 0}
                  className="w-full h-12 text-lg font-semibold btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>

                {quizWords.length === 0 && selectedQuizCategories.length > 0 && (
                  <p className="text-sm text-red-600 text-center">
                    No words found in selected categories. Please choose different categories.
                  </p>
                )}
              </div>
              
              <Button
                onClick={goHome}
                variant="outline"
                className="w-full btn-fun border-2 border-purple-300 text-purple-700"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Quiz Complete!</h2>
          <Button onClick={() => navigate('/results')} className="btn-fun">
            View Results
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-2 text-fun-shadow flex items-center justify-center">
          <Brain className="h-10 w-10 mr-3" />
          Quiz Time 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          Word {currentWordIndex + 1} of {quizWords.length}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
      >
        <div className="flex justify-between text-sm text-purple-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </motion.div>

      {/* Word Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-8 text-center space-y-8">                  {/* Word Image */}
                  <motion.div
                    className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentWord.image_url ? (
                      <ImageFallback
                        src={currentWord.image_url}
                        alt={currentWord.word}
                        className="w-full h-full object-cover"
                        fallbackEmoji={currentWord.emoji || "❓"}
                        showRetry={true}
                      />
                    ) : (
                      <div className="text-8xl">{currentWord.emoji || "❓"}</div>
                    )}
                  </motion.div>         {/* Word Text */}
            <motion.h2 
              className="text-6xl font-bold text-gray-800 text-fun-shadow"
              key={`word-${currentWord.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentWord.word}
            </motion.h2>

            {/* Difficulty Badge */}
            <motion.div 
              className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentWord.difficulty.charAt(0).toUpperCase() + currentWord.difficulty.slice(1)} Level
            </motion.div>

            {/* Sound Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={speakWord}
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full w-20 h-20 shadow-lg pulse-glow"
              >
                <Volume2 className="w-10 h-10" />
              </Button>
            </motion.div>

            {/* Answer Buttons */}
            <AnimatePresence>
              {!showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-6 justify-center"
                >
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl px-8 py-6 text-xl font-semibold shadow-lg btn-fun"
                  >
                    <Check className="w-8 h-8 mr-3" />
                    I Remember! ✅
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl px-8 py-6 text-xl font-semibold shadow-lg btn-fun"
                  >
                    <X className="w-8 h-8 mr-3" />
                    I Forgot ❌
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`p-6 rounded-2xl ${
                    lastAnswer ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {lastAnswer ? '🎉' : '💪'}
                  </div>
                  <p className={`text-xl font-semibold ${
                    lastAnswer ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {lastAnswer ? 'Great job!' : 'Keep practicing!'}
                  </p>
                  <div className="flex items-center justify-center mt-2 text-purple-600">
                    <ArrowRight className="h-5 w-5 mr-1" />
                    <span>Moving to next word...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex justify-center space-x-4"
      >
        <Button
          onClick={restartTest}
          variant="outline"
          className="btn-fun border-2 border-purple-300 text-purple-700"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Restart Quiz
        </Button>
        
        <Button
          onClick={goHome}
          variant="outline"
          className="btn-fun border-2 border-purple-300 text-purple-700"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>

      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCategorySelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCategorySelection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Filter className="h-6 w-6 mr-2" />
                    Choose Quiz Categories
                  </h2>
                  <Button
                    onClick={() => setShowCategorySelection(false)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-purple-700">
                      Select categories for your quiz (leave empty to include all words):
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedQuizCategories([])}
                        size="sm"
                        variant="outline"
                        className="text-purple-600 border-purple-300"
                      >
                        Clear All
                      </Button>
                      <Button
                        onClick={() => setSelectedQuizCategories(categories.map(cat => cat.id))}
                        size="sm"
                        variant="outline"
                        className="text-purple-600 border-purple-300"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const isSelected = selectedQuizCategories.includes(category.id)
                      const wordCount = words.filter(word => word.category === category.id).length

                      return (
                        <Card
                          key={category.id}
                          className={`cursor-pointer transition-all duration-200 relative ${
                            isSelected
                              ? 'ring-2 ring-purple-500 bg-purple-50'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`inline-block px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${category.color} text-white mb-2`}>
                              <span className="mr-1">{category.emoji}</span>
                              {category.name}
                            </div>
                            <p className="text-xs text-gray-600">
                              {wordCount} word{wordCount !== 1 ? 's' : ''}
                            </p>
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-purple-500" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-purple-600">
                      {selectedQuizCategories.length === 0
                        ? `All ${words.length} words will be included`
                        : `${quizWords.length} words selected`
                      }
                    </p>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setShowCategorySelection(false)}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={startQuizWithCategories}
                        disabled={quizWords.length === 0}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Start Quiz ({quizWords.length} words)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WordTesting
