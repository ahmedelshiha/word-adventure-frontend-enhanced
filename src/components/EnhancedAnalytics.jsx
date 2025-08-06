/**
 * Enhanced Analytics Dashboard Component
 * Provides comprehensive learning analytics and insights
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'
import { 
  TrendingUp, Users, BookOpen, Trophy, Clock, Target,
  Calendar, Star, Zap, Brain, Heart, Award
} from 'lucide-react'
import { useApp } from '../App'

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const EnhancedAnalytics = () => {
  const { words, testResults, userStats, categories } = useApp()
  const [timeRange, setTimeRange] = useState('week') // week, month, year
  const [analytics, setAnalytics] = useState({
    dailyProgress: [],
    categoryPerformance: [],
    learningStreak: 0,
    totalWordsLearned: 0,
    averageAccuracy: 0,
    timeSpent: 0,
    achievements: [],
    weeklyGoals: {
      target: 50,
      current: 32,
      percentage: 64
    }
  })

  useEffect(() => {
    calculateAnalytics()
  }, [words, testResults, userStats, timeRange])

  const calculateAnalytics = () => {
    // Calculate daily progress for the selected time range
    const now = new Date()
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365
    const dailyProgress = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayResults = testResults.filter(result => {
        const resultDate = new Date(result.timestamp).toISOString().split('T')[0]
        return resultDate === dateStr
      })
      
      const wordsLearned = dayResults.filter(r => r.remembered).length
      const totalAttempts = dayResults.length
      const accuracy = totalAttempts > 0 ? (wordsLearned / totalAttempts) * 100 : 0
      
      dailyProgress.push({
        date: date.toLocaleDateString('en-US', { 
          weekday: timeRange === 'week' ? 'short' : undefined,
          month: 'short',
          day: 'numeric'
        }),
        wordsLearned,
        accuracy: Math.round(accuracy),
        attempts: totalAttempts
      })
    }

    // Calculate category performance
    const categoryStats = categories.map(category => {
      const categoryWords = words.filter(word => word.category === category.id)
      const learnedWords = categoryWords.filter(word => word.known).length
      const totalWords = categoryWords.length
      const progress = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0
      
      const categoryResults = testResults.filter(result => {
        const word = words.find(w => w.id === result.wordId)
        return word && word.category === category.id
      })
      
      const accuracy = categoryResults.length > 0 
        ? (categoryResults.filter(r => r.remembered).length / categoryResults.length) * 100 
        : 0

      return {
        name: category.name,
        progress: Math.round(progress),
        accuracy: Math.round(accuracy),
        learned: learnedWords,
        total: totalWords,
        color: category.color || COLORS[Math.floor(Math.random() * COLORS.length)]
      }
    })

    // Calculate overall stats
    const totalWordsLearned = words.filter(word => word.known).length
    const totalAttempts = testResults.length
    const correctAttempts = testResults.filter(r => r.remembered).length
    const averageAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

    // Simulate time spent (in real app, this would be tracked)
    const timeSpent = testResults.length * 2.5 // Assume 2.5 minutes per test on average

    setAnalytics({
      dailyProgress,
      categoryPerformance: categoryStats,
      learningStreak: userStats.streak,
      totalWordsLearned,
      averageAccuracy: Math.round(averageAccuracy),
      timeSpent: Math.round(timeSpent),
      achievements: userStats.achievements,
      weeklyGoals: {
        target: 50,
        current: Math.min(totalWordsLearned, 50),
        percentage: Math.min((totalWordsLearned / 50) * 100, 100)
      }
    })
  }

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'purple', trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </motion.div>
  )

  const AchievementBadge = ({ achievement, unlocked }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        unlocked 
          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' 
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="text-center">
        <div className={`text-2xl mb-2 ${unlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        <h4 className={`font-medium text-sm ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {achievement.name}
        </h4>
        <p className={`text-xs mt-1 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.description}
        </p>
      </div>
    </motion.div>
  )

  const achievements = [
    { id: 'first_word', name: 'First Steps', description: 'Learned your first word', icon: '🌟' },
    { id: 'word_explorer', name: 'Word Explorer', description: 'Learned 10 words', icon: '🗺️' },
    { id: 'vocabulary_master', name: 'Vocabulary Master', description: 'Learned 50 words', icon: '👑' },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 10 words in under 30 seconds', icon: '⚡' },
    { id: 'perfect_week', name: 'Perfect Week', description: 'Practice every day for a week', icon: '📅' },
    { id: 'category_master', name: 'Category Master', description: 'Master all words in a category', icon: '🎯' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600 mt-1">Track your progress and achievements</p>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Words Learned"
          value={analytics.totalWordsLearned}
          subtitle={`${words.length - analytics.totalWordsLearned} remaining`}
          icon={BookOpen}
          color="purple"
          trend="+12% this week"
        />
        <MetricCard
          title="Learning Streak"
          value={`${analytics.learningStreak} days`}
          subtitle="Keep it up!"
          icon={Zap}
          color="orange"
        />
        <MetricCard
          title="Average Accuracy"
          value={`${analytics.averageAccuracy}%`}
          subtitle="Great progress!"
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Time Spent"
          value={`${Math.floor(analytics.timeSpent / 60)}h ${analytics.timeSpent % 60}m`}
          subtitle="This week"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Weekly Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Weekly Goal</h3>
            <p className="text-purple-100">Learn 50 new words this week</p>
          </div>
          <Trophy className="w-8 h-8 text-yellow-300" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{analytics.weeklyGoals.current} / {analytics.weeklyGoals.target} words</span>
            <span>{Math.round(analytics.weeklyGoals.percentage)}%</span>
          </div>
          <div className="w-full bg-purple-400 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analytics.weeklyGoals.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-yellow-300 h-3 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="wordsLearned" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {analytics.achievements.length} / {achievements.length} unlocked
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={analytics.achievements.includes(achievement.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Detailed Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
        
        <div className="space-y-4">
          {analytics.categoryPerformance.map((category, index) => (
            <div key={category.name} className="flex items-center space-x-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">
                    {category.learned} / {category.total} words
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {category.progress}%
                </div>
                <div className="text-xs text-gray-500">
                  {category.accuracy}% accuracy
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default EnhancedAnalytics

