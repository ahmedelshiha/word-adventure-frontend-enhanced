import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useApp } from '../App'
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  RotateCcw, 
  Home,
  Brain,
  BookOpen,
  Award,
  Zap,
  Check
} from 'lucide-react'

const Results = () => {
  const navigate = useNavigate()
  const { words, testResults, resetTest } = useApp()
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (testResults.length > 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [testResults])

  const calculateResults = () => {
    if (testResults.length === 0) {
      // Show overall progress if no test results
      const knownWords = words.filter(w => w.known).length
      const totalWords = words.length
      const percentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0
      
      return {
        totalTested: totalWords,
        remembered: knownWords,
        forgot: totalWords - knownWords,
        percentage,
        isTestResult: false
      }
    }

    const remembered = testResults.filter(result => result.remembered).length
    const forgot = testResults.length - remembered
    const percentage = testResults.length > 0 ? Math.round((remembered / testResults.length) * 100) : 0

    return {
      totalTested: testResults.length,
      remembered,
      forgot,
      percentage,
      isTestResult: true
    }
  }

  const results = calculateResults()

  const getPerformanceMessage = () => {
    if (results.percentage >= 90) return { message: "Outstanding! You're a word master! 🌟", color: "text-yellow-600", emoji: "🏆" }
    if (results.percentage >= 80) return { message: "Excellent work! Keep it up! 🎉", color: "text-green-600", emoji: "🎯" }
    if (results.percentage >= 70) return { message: "Great job! You're doing well! 👏", color: "text-blue-600", emoji: "⭐" }
    if (results.percentage >= 60) return { message: "Good effort! Keep practicing! 💪", color: "text-purple-600", emoji: "📚" }
    return { message: "Keep learning! You'll get better! 🌱", color: "text-pink-600", emoji: "🌟" }
  }

  const performance = getPerformanceMessage()

  const getDifficultyBreakdown = () => {
    const breakdown = { easy: { total: 0, remembered: 0 }, medium: { total: 0, remembered: 0 }, hard: { total: 0, remembered: 0 } }
    
    if (results.isTestResult) {
      testResults.forEach(result => {
        const word = words.find(w => w.id === result.wordId)
        if (word) {
          breakdown[word.difficulty].total++
          if (result.remembered) breakdown[word.difficulty].remembered++
        }
      })
    } else {
      words.forEach(word => {
        breakdown[word.difficulty].total++
        if (word.known) breakdown[word.difficulty].remembered++
      })
    }
    
    return breakdown
  }

  const difficultyBreakdown = getDifficultyBreakdown()

  const retakeTest = () => {
    resetTest()
    navigate('/test')
  }

  const goHome = () => {
    navigate('/')
  }

  const goToLibrary = () => {
    navigate('/library')
  }

  return (
    <div className="space-y-8">
      {/* Celebration Animation */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 2, repeat: 2 }}
            className="text-9xl"
          >
            🎉
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-2 text-fun-shadow flex items-center justify-center">
          <Trophy className="h-10 w-10 mr-3" />
          {results.isTestResult ? 'Quiz Results' : 'Your Progress'} 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          {results.isTestResult ? 'See how you did on your quiz!' : 'Check your overall learning progress'}
        </p>
      </motion.div>

      {/* Main Results Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {performance.emoji}
            </motion.div>
            <CardTitle className="text-3xl font-bold">
              {results.percentage}% Score!
            </CardTitle>
            <p className="text-xl opacity-90">
              {performance.message}
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-700">{results.remembered}</div>
                <div className="text-sm text-green-600">Remembered</div>
                <Check className="h-5 w-5 mx-auto mt-1 text-green-500" />
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <div className="text-3xl font-bold text-red-700">{results.forgot}</div>
                <div className="text-sm text-red-600">Need Practice</div>
                <Brain className="h-5 w-5 mx-auto mt-1 text-red-500" />
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-700">{results.totalTested}</div>
                <div className="text-sm text-blue-600">Total Words</div>
                <Target className="h-5 w-5 mx-auto mt-1 text-blue-500" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-600">
                <span>Overall Progress</span>
                <span>{results.percentage}%</span>
              </div>
              <Progress value={results.percentage} className="h-4" />
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {results.percentage >= 50 && (
                  <div className="flex items-center text-green-700">
                    <Star className="h-4 w-4 mr-1" />
                    Word Learner
                  </div>
                )}
                {results.percentage >= 75 && (
                  <div className="flex items-center text-blue-700">
                    <Zap className="h-4 w-4 mr-1" />
                    Quick Learner
                  </div>
                )}
                {results.percentage >= 90 && (
                  <div className="flex items-center text-purple-700">
                    <Trophy className="h-4 w-4 mr-1" />
                    Word Master
                  </div>
                )}
                {results.totalTested >= 10 && (
                  <div className="flex items-center text-orange-700">
                    <Target className="h-4 w-4 mr-1" />
                    Dedicated Student
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Difficulty Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Performance by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(difficultyBreakdown).map(([difficulty, data]) => {
                const percentage = data.total > 0 ? Math.round((data.remembered / data.total) * 100) : 0
                const colors = {
                  easy: 'from-green-400 to-green-500',
                  medium: 'from-yellow-400 to-yellow-500',
                  hard: 'from-red-400 to-red-500'
                }
                
                return (
                  <div key={difficulty} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${colors[difficulty]} flex items-center justify-center text-white font-bold text-lg`}>
                      {percentage}%
                    </div>
                    <h4 className="font-semibold text-gray-800 capitalize">{difficulty}</h4>
                    <p className="text-sm text-gray-600">{data.remembered}/{data.total} words</p>
                    <Progress value={percentage} className="h-2 mt-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {results.isTestResult && (
          <Button
            onClick={retakeTest}
            className="btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake Quiz
          </Button>
        )}
        
        <Button
          onClick={goToLibrary}
          className="btn-fun bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Practice Words
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

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-2">
          Keep Learning! 🌟
        </h3>
        <p className="text-purple-600">
          {results.percentage < 100 
            ? "Practice the words you missed to improve your score!" 
            : "Amazing! You've mastered all the words. Try adding more challenging ones!"
          }
        </p>
      </motion.div>
    </div>
  )
}

export default Results

