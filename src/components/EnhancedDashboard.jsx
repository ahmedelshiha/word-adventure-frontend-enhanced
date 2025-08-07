import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
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
  TrendingUp,
  Heart,
  Gift,
  Award,
  Crown,
  Sparkles
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { 
    words, 
    currentWordIndex, 
    setCurrentWordIndex, 
    userStats, 
    virtualPet, 
    feedPet, 
    playWithPet,
    updateWordStatus 
  } = useApp()
  
  const [currentWord, setCurrentWord] = useState(words[0])
  const [showAchievement, setShowAchievement] = useState(null)
  const [petAnimation, setPetAnimation] = useState('idle')

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[currentWordIndex] || words[0])
    }
  }, [words, currentWordIndex])

  // Pet happiness decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastFed = Date.now() - virtualPet.lastFed
      const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60)
      
      if (hoursWithoutFood > 2) {
        // Pet gets hungry after 2 hours
        setPetAnimation('hungry')
      } else if (virtualPet.happiness > 80) {
        setPetAnimation('happy')
      } else if (virtualPet.happiness > 50) {
        setPetAnimation('idle')
      } else {
        setPetAnimation('sad')
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [virtualPet])

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
  const xpToNextLevel = ((userStats.level) * 100) - userStats.xp
  const currentLevelProgress = (userStats.xp % 100)

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  const markAsKnown = () => {
    updateWordStatus(currentWord.id, true)
    setShowAchievement('word_learned')
    setTimeout(() => setShowAchievement(null), 3000)
    
    // Move to next word
    const nextIndex = (currentWordIndex + 1) % words.length
    setCurrentWordIndex(nextIndex)
  }

  const markAsUnknown = () => {
    updateWordStatus(currentWord.id, false)
    
    // Move to next word
    const nextIndex = (currentWordIndex + 1) % words.length
    setCurrentWordIndex(nextIndex)
  }

  const handleFeedPet = () => {
    feedPet()
    setPetAnimation('eating')
    setTimeout(() => setPetAnimation('happy'), 2000)
  }

  const handlePlayWithPet = () => {
    playWithPet()
    setPetAnimation('playing')
    setTimeout(() => setPetAnimation('happy'), 3000)
  }

  const achievements = [
    { id: 'first_word', name: 'First Steps', description: 'Learn your first word', icon: '🎯', unlocked: userStats.achievements.includes('first_word') },
    { id: 'word_explorer', name: 'Word Explorer', description: 'Learn 10 words', icon: '🗺️', unlocked: userStats.achievements.includes('word_explorer') },
    { id: 'vocabulary_master', name: 'Vocabulary Master', description: 'Learn 50 words', icon: '👑', unlocked: userStats.achievements.includes('vocabulary_master') },
    { id: 'quiz_champion', name: 'Quiz Champion', description: 'Take 20 quizzes', icon: '🏆', unlocked: userStats.totalQuizzesTaken >= 20 },
    { id: 'streak_master', name: 'Streak Master', description: '7-day learning streak', icon: '🔥', unlocked: userStats.streak >= 7 }
  ]

  const getPetEmoji = () => {
    const baseEmoji = virtualPet.type === 'cat' ? '🐱' : virtualPet.type === 'dog' ? '🐶' : '🐰'
    
    switch (petAnimation) {
      case 'happy': return '😸'
      case 'eating': return '😋'
      case 'playing': return '😺'
      case 'hungry': return '😿'
      case 'sad': return '😾'
      default: return baseEmoji
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Achievement Notification */}
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6" />
              <span className="font-bold">Achievement Unlocked!</span>
            </div>
          </motion.div>
        )}

        {/* Header with Level and XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Level {userStats.level} Explorer</h1>
                <p className="text-gray-600">{userStats.xp} XP • {xpToNextLevel} XP to next level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-bold text-orange-500">{userStats.streak} Day Streak</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.min(userStats.streak, 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{currentLevelProgress}/100 XP</span>
            </div>
            <Progress value={currentLevelProgress} className="h-3" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Learning Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-indigo-800">Word of the Moment</CardTitle>
                <CardDescription className="text-indigo-600">
                  Learn and practice new vocabulary words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentWord && (
                  <motion.div
                    key={currentWord.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="text-8xl mb-4">
                      {currentWord.image_url ? (
                        <img 
                          src={currentWord.image_url} 
                          alt={currentWord.word}
                          className="w-24 h-24 mx-auto object-cover rounded-lg"
                        />
                      ) : (
                        currentWord.emoji || currentWord.image || '📚'
                      )}
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentWord.word}</h2>
                    
                    {currentWord.pronunciation && (
                      <p className="text-lg text-gray-600 italic">{currentWord.pronunciation}</p>
                    )}
                    
                    {currentWord.definition && (
                      <p className="text-lg text-gray-700 max-w-md mx-auto">{currentWord.definition}</p>
                    )}
                    
                    {currentWord.example && (
                      <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-gray-600 mb-1">Example:</p>
                        <p className="text-gray-800 italic">"{currentWord.example}"</p>
                      </div>
                    )}
                    
                    {currentWord.funFact && (
                      <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto border-l-4 border-yellow-400">
                        <p className="text-sm text-yellow-600 mb-1 flex items-center">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Fun Fact:
                        </p>
                        <p className="text-yellow-800 text-sm">{currentWord.funFact}</p>
                      </div>
                    )}

                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={() => speakWord(currentWord.word)}
                        variant="outline"
                        size="lg"
                        className="bg-white hover:bg-blue-50"
                      >
                        <Volume2 className="w-5 h-5 mr-2" />
                        Listen
                      </Button>
                      
                      <Button
                        onClick={markAsKnown}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="lg"
                      >
                        <Target className="w-5 h-5 mr-2" />
                        I Know This!
                      </Button>
                      
                      <Button
                        onClick={markAsUnknown}
                        variant="outline"
                        size="lg"
                        className="bg-white hover:bg-red-50"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        Need Practice
                      </Button>
                    </div>

                    <div className="flex justify-center space-x-2 pt-2">
                      <Badge variant={currentWord.difficulty === 'easy' ? 'default' : 'secondary'}>
                        {currentWord.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentWord.category}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Virtual Pet */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg text-rose-800">Your Learning Buddy</CardTitle>
                  <CardDescription className="text-rose-600">{virtualPet.name}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <motion.div
                    animate={{ 
                      scale: petAnimation === 'playing' ? [1, 1.1, 1] : 1,
                      rotate: petAnimation === 'eating' ? [0, -5, 5, 0] : 0
                    }}
                    transition={{ duration: 0.5, repeat: petAnimation === 'playing' ? Infinity : 0 }}
                    className="text-6xl"
                  >
                    {getPetEmoji()}
                  </motion.div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        Happiness
                      </span>
                      <span>{virtualPet.happiness}%</span>
                    </div>
                    <Progress value={virtualPet.happiness} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        Growth
                      </span>
                      <span>{virtualPet.growth}%</span>
                    </div>
                    <Progress value={virtualPet.growth} className="h-2" />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleFeedPet}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      Feed
                    </Button>
                    <Button
                      onClick={handlePlayWithPet}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{stats.known}</div>
                    <div className="text-sm text-emerald-700">Words Learned</div>
                    <div className="text-xs text-gray-600">out of {stats.total} total</div>
                  </div>
                  
                  <Progress value={stats.percentage} className="h-3" />
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-100 rounded p-2">
                      <div className="font-semibold text-green-700">{stats.easy.known}/{stats.easy.total}</div>
                      <div className="text-green-600">Easy</div>
                    </div>
                    <div className="bg-yellow-100 rounded p-2">
                      <div className="font-semibold text-yellow-700">{stats.medium.known}/{stats.medium.total}</div>
                      <div className="text-yellow-600">Medium</div>
                    </div>
                    <div className="bg-red-100 rounded p-2">
                      <div className="font-semibold text-red-700">{stats.hard.known}/{stats.hard.total}</div>
                      <div className="text-red-600">Hard</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {achievements.slice(0, 4).map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-2 rounded-lg text-center ${
                          achievement.unlocked 
                            ? 'bg-yellow-100 border-2 border-yellow-300' 
                            : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{achievement.icon}</div>
                        <div className="text-xs font-semibold">{achievement.name}</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate('/progress')}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    View All
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigate('/library')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Words
                  </Button>
                  <Button
                    onClick={() => navigate('/test')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                  <Button
                    onClick={() => navigate('/progress')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

