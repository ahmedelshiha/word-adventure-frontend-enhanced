import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useApp } from '../App'
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Brain,
  BookOpen,
  Zap,
  Trophy,
  Star,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts'

const ProgressDashboard = () => {
  const { words, testResults } = useApp()
  const [progressData, setProgressData] = useState([])
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 })
  const [badges, setBadges] = useState([])

  useEffect(() => {
    calculateProgressData()
    calculateStreakData()
    calculateBadges()
  }, [words, testResults])

  const calculateProgressData = () => {
    // Generate last 7 days progress data
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Count test results for this date
      const dayResults = testResults.filter(result => {
        const resultDate = new Date(result.timestamp).toISOString().split('T')[0]
        return resultDate === dateStr
      })
      
      const remembered = dayResults.filter(r => r.remembered).length
      const total = dayResults.length
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateStr,
        wordsLearned: remembered,
        totalTested: total,
        percentage: total > 0 ? Math.round((remembered / total) * 100) : 0
      })
    }
    
    setProgressData(last7Days)
  }

  const calculateStreakData = () => {
    if (testResults.length === 0) {
      setStreakData({ current: 0, longest: 0 })
      return
    }

    // Sort test results by date
    const sortedResults = [...testResults].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // Group by date
    const resultsByDate = {}
    sortedResults.forEach(result => {
      const date = new Date(result.timestamp).toISOString().split('T')[0]
      if (!resultsByDate[date]) {
        resultsByDate[date] = []
      }
      resultsByDate[date].push(result)
    })

    // Calculate streaks
    const dates = Object.keys(resultsByDate).sort()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    const today = new Date().toISOString().split('T')[0]
    let lastDate = null
    
    dates.forEach(date => {
      const dayResults = resultsByDate[date]
      const hasActivity = dayResults.length > 0
      
      if (hasActivity) {
        if (!lastDate || isConsecutiveDay(lastDate, date)) {
          tempStreak++
        } else {
          tempStreak = 1
        }
        
        longestStreak = Math.max(longestStreak, tempStreak)
        
        // Check if this contributes to current streak
        if (date === today || isRecentActivity(date)) {
          currentStreak = tempStreak
        }
        
        lastDate = date
      } else {
        tempStreak = 0
      }
    })

    setStreakData({ current: currentStreak, longest: longestStreak })
  }

  const isConsecutiveDay = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
  }

  const isRecentActivity = (date) => {
    const activityDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today - activityDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 1
  }

  const calculateBadges = () => {
    const earnedBadges = []
    
    const knownWords = words.filter(w => w.known).length
    const totalWords = words.length
    const percentage = totalWords > 0 ? (knownWords / totalWords) * 100 : 0
    
    // Learning badges
    if (knownWords >= 5) earnedBadges.push({ id: 'first_five', name: 'First Five', icon: '🌟', description: 'Learned 5 words' })
    if (knownWords >= 10) earnedBadges.push({ id: 'ten_words', name: 'Word Explorer', icon: '🗺️', description: 'Learned 10 words' })
    if (knownWords >= 25) earnedBadges.push({ id: 'twenty_five', name: 'Word Master', icon: '🎓', description: 'Learned 25 words' })
    if (knownWords >= 50) earnedBadges.push({ id: 'fifty_words', name: 'Vocabulary Expert', icon: '👑', description: 'Learned 50 words' })
    
    // Performance badges
    if (percentage >= 80) earnedBadges.push({ id: 'high_achiever', name: 'High Achiever', icon: '🏆', description: '80% words known' })
    if (percentage >= 95) earnedBadges.push({ id: 'perfectionist', name: 'Perfectionist', icon: '💎', description: '95% words known' })
    
    // Streak badges
    if (streakData.current >= 3) earnedBadges.push({ id: 'three_day_streak', name: '3-Day Streak', icon: '🔥', description: '3 days in a row' })
    if (streakData.longest >= 7) earnedBadges.push({ id: 'week_warrior', name: 'Week Warrior', icon: '⚡', description: '7-day streak' })
    
    // Test badges
    if (testResults.length >= 10) earnedBadges.push({ id: 'quiz_taker', name: 'Quiz Taker', icon: '📝', description: 'Completed 10 quizzes' })
    if (testResults.length >= 25) earnedBadges.push({ id: 'test_master', name: 'Test Master', icon: '🎯', description: 'Completed 25 quizzes' })
    
    setBadges(earnedBadges)
  }

  const getOverallStats = () => {
    const knownWords = words.filter(w => w.known).length
    const totalWords = words.length
    const customWords = words.filter(w => w.isCustom).length
    
    const difficultyStats = {
      easy: { total: 0, known: 0 },
      medium: { total: 0, known: 0 },
      hard: { total: 0, known: 0 }
    }
    
    words.forEach(word => {
      difficultyStats[word.difficulty].total++
      if (word.known) difficultyStats[word.difficulty].known++
    })
    
    const totalTestResults = testResults.length
    const correctAnswers = testResults.filter(r => r.remembered).length
    const testAccuracy = totalTestResults > 0 ? Math.round((correctAnswers / totalTestResults) * 100) : 0
    
    return {
      knownWords,
      totalWords,
      customWords,
      percentage: totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0,
      difficultyStats,
      totalTestResults,
      testAccuracy
    }
  }

  const stats = getOverallStats()

  const difficultyChartData = [
    { name: 'Easy', known: stats.difficultyStats.easy.known, total: stats.difficultyStats.easy.total, color: '#10B981' },
    { name: 'Medium', known: stats.difficultyStats.medium.known, total: stats.difficultyStats.medium.total, color: '#F59E0B' },
    { name: 'Hard', known: stats.difficultyStats.hard.known, total: stats.difficultyStats.hard.total, color: '#EF4444' }
  ]

  const pieChartData = [
    { name: 'Known', value: stats.knownWords, color: '#10B981' },
    { name: 'Learning', value: stats.totalWords - stats.knownWords, color: '#6B7280' }
  ]

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
          <BarChart3 className="h-10 w-10 mr-3" />
          Progress Dashboard 
          <motion.span 
            className="ml-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📊
          </motion.span>
        </h1>
        <p className="text-lg text-purple-600">
          Track your learning journey and achievements
        </p>
      </motion.div>

      {/* Key Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-green-700">{stats.knownWords}</div>
            <div className="text-sm text-green-600">Words Learned</div>
            <div className="text-xs text-green-500 mt-1">of {stats.totalWords} total</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-700">{stats.percentage}%</div>
            <div className="text-sm text-blue-600">Overall Progress</div>
            <Progress value={stats.percentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-700">{streakData.current}</div>
            <div className="text-sm text-orange-600">Current Streak</div>
            <div className="text-xs text-orange-500 mt-1">Best: {streakData.longest} days</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-purple-700">{badges.length}</div>
            <div className="text-sm text-purple-600">Badges Earned</div>
            <div className="text-xs text-purple-500 mt-1">Keep learning!</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2" />
                Last 7 Days Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'wordsLearned' ? 'Words Learned' : 'Total Tested']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wordsLearned" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalTested" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800 flex items-center">
                <Target className="h-6 w-6 mr-2" />
                Progress by Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={difficultyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'known' ? 'Known' : 'Total']}
                  />
                  <Bar dataKey="known" fill="#10B981" />
                  <Bar dataKey="total" fill="#E5E7EB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Award className="h-6 w-6 mr-2" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl text-center border border-yellow-200"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-gray-800 text-sm">{badge.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No badges yet</h3>
                <p className="text-gray-500">Keep learning to earn your first badge!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Detailed Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Word Library
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Words:</span>
                    <span className="font-medium">{stats.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Words Known:</span>
                    <span className="font-medium text-green-600">{stats.knownWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Words:</span>
                    <span className="font-medium text-blue-600">{stats.customWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span className="font-medium">{stats.percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quiz Performance
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Quizzes:</span>
                    <span className="font-medium">{stats.totalTestResults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="font-medium text-green-600">{testResults.filter(r => r.remembered).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-medium">{stats.testAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Activity:</span>
                    <span className="font-medium">{streakData.current > 0 ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Learning Streaks
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Streak:</span>
                    <span className="font-medium text-orange-600">{streakData.current} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak:</span>
                    <span className="font-medium text-red-600">{streakData.longest} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-medium">{progressData.filter(d => d.totalTested > 0).length} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-medium">{new Set(testResults.map(r => new Date(r.timestamp).toDateString())).size}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ProgressDashboard

