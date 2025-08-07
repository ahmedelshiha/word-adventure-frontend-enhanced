import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useApp } from '../App'
import { 
  Volume2, 
  Play, 
  BookOpen, 
  Brain, 
  Trophy, 
  Target,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { words, currentWordIndex, setCurrentWordIndex } = useApp()
  const [currentWord, setCurrentWord] = useState(words[0])
  const [dailyStreak, setDailyStreak] = useState(3)

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[currentWordIndex] || words[0])
    }
  }, [words, currentWordIndex])

  const calculateStats = () => {
    const knownCount = words.filter(w => w.known).length
    const totalWords = words.length
    const percentage = totalWords > 0 ? Math.round((knownCount / totalWords) * 100) : 0
    
    const easyWords = words.filter(w => w.difficulty === 'easy')
    const mediumWords = words.filter(w => w.difficulty === 'medium')
    const hardWords = words.filter(w => w.difficulty === 'hard')
    
    return {
      known: knownCount,
      total: totalWords,
      percentage,
      easy: { total: easyWords.length, known: easyWords.filter(w => w.known).length },
      medium: { total: mediumWords.length, known: mediumWords.filter(w => w.known).length },
      hard: { total: hardWords.length, known: hardWords.filter(w => w.known).length }
    }
  }

  const stats = calculateStats()

  const speakWord = () => {
    if ('speechSynthesis' in window && currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const startQuiz = () => {
    setCurrentWordIndex(0)
    navigate('/test')
  }

  const quickActions = [
    {
      title: 'Start Quiz',
      description: 'Test your knowledge',
      icon: Brain,
      emoji: '🧠',
      action: startQuiz,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Word Library',
      description: 'Browse all words',
      icon: BookOpen,
      emoji: '📚',
      action: () => navigate('/library'),
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'View Results',
      description: 'Check your progress',
      icon: Trophy,
      emoji: '🏆',
      action: () => navigate('/results'),
      color: 'from-yellow-400 to-yellow-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Category Initializer - Temporary for setup */}
      <CategoryInitializer />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h1 
          className="text-4xl lg:text-5xl font-bold text-purple-800 mb-2 text-fun-shadow"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Welcome to Word Adventure! 
          <motion.span 
            className="inline-block ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟
          </motion.span>
        </motion.h1>
        <p className="text-lg text-purple-600">
          Let's learn some amazing words today!
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="card-hover bg-gradient-to-br from-purple-100 to-purple-200 border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-700">{stats.known}</div>
            <div className="text-sm text-purple-600">Words Learned</div>
            <Star className="h-5 w-5 mx-auto mt-1 text-purple-500" />
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-blue-100 to-blue-200 border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{stats.percentage}%</div>
            <div className="text-sm text-blue-600">Progress</div>
            <TrendingUp className="h-5 w-5 mx-auto mt-1 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-green-100 to-green-200 border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{dailyStreak}</div>
            <div className="text-sm text-green-600">Day Streak</div>
            <Zap className="h-5 w-5 mx-auto mt-1 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-yellow-100 to-yellow-200 border-0">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-700">{stats.total}</div>
            <div className="text-sm text-yellow-600">Total Words</div>
            <Target className="h-5 w-5 mx-auto mt-1 text-yellow-500" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Word Card */}
      {currentWord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="card-hover bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-purple-800">Word of the Moment</CardTitle>
              <CardDescription>Practice with this word</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Word Image */}
              <motion.div
                className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-8xl">{currentWord.image}</div>
              </motion.div>

              {/* Word Text */}
              <motion.h2 
                className="text-5xl font-bold text-gray-800 text-fun-shadow"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentWord.word}
              </motion.h2>

              {/* Difficulty Badge */}
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentWord.difficulty.charAt(0).toUpperCase() + currentWord.difficulty.slice(1)} Level
              </div>

              {/* Sound Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={speakWord}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full w-16 h-16 shadow-lg pulse-glow"
                >
                  <Volume2 className="w-8 h-8" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Your Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-purple-600 mb-2">
                <span>Overall Progress</span>
                <span>{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <div className="text-lg font-bold text-green-700">
                  {stats.easy.known}/{stats.easy.total}
                </div>
                <div className="text-sm text-green-600">Easy Words</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <div className="text-lg font-bold text-yellow-700">
                  {stats.medium.known}/{stats.medium.total}
                </div>
                <div className="text-sm text-yellow-600">Medium Words</div>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <div className="text-lg font-bold text-red-700">
                  {stats.hard.known}/{stats.hard.total}
                </div>
                <div className="text-sm text-red-600">Hard Words</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="card-hover bg-white/90 backdrop-blur-sm border-0 shadow-lg cursor-pointer"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <span className="text-2xl">{action.emoji}</span>
                </motion.div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-purple-600 text-sm">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Dashboard
