import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useAuth, useApp } from '../App'
import AppearanceSettings from './AppearanceSettings'
import { 
  Settings, 
  User, 
  Volume2, 
  Palette, 
  Shield, 
  Download,
  Upload,
  RotateCcw,
  Save,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  Brain,
  Trophy
} from 'lucide-react'

const ParentSettings = () => {
  const { user } = useAuth()
  const { words, setWords, resetTest, testResults } = useApp()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [settings, setSettings] = useState({
    // Learning Preferences
    soundEnabled: true,
    autoAdvance: false,
    showDifficulty: true,
    showHints: true,
    showEmojis: true,
    showPronunciation: true,
    showExamples: true,
    showFunFacts: true,
    autoPlayAudio: false,
    repeatAudio: false,
    slowAudio: false,
    
    // Quiz Settings
    quizMode: 'mixed', // 'mixed', 'recognition', 'spelling', 'definition'
    quizDifficulty: 'adaptive', // 'easy', 'medium', 'hard', 'adaptive'
    questionsPerQuiz: 10,
    showCorrectAnswer: true,
    allowRetries: true,
    timeLimit: 0, // 0 = no limit, in seconds
    
    // Progress & Motivation
    dailyGoal: 5,
    weeklyGoal: 25,
    showProgress: true,
    showAchievements: true,
    enableStreaks: true,
    celebrateSuccess: true,
    
    // Appearance
    darkMode: false,
    fontSize: 'medium', // 'small', 'medium', 'large'
    colorTheme: 'default', // 'default', 'blue', 'green', 'purple', 'pink'
    animationsEnabled: true,
    reducedMotion: false,
    
    // Parental Controls
    childName: user?.username || '',
    passwordProtected: false,
    timeRestrictions: false,
    maxDailyTime: 60, // minutes
    allowedCategories: [], // empty = all allowed
    
    // Data & Privacy
    saveProgress: true,
    shareAnalytics: false,
    autoBackup: true
  })

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('settings') // 'settings' or 'appearance'

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('word_adventure_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    
    // Check if password protection is enabled
    const hasPassword = localStorage.getItem('word_adventure_parent_password')
    if (hasPassword && settings.passwordProtected) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  const handlePasswordSubmit = () => {
    const savedPassword = localStorage.getItem('word_adventure_parent_password')
    if (savedPassword === password) {
      setIsAuthenticated(true)
      setPasswordError('')
      setPassword('')
    } else {
      setPasswordError('Incorrect password. Please try again.')
    }
  }

  const handleSetPassword = () => {
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    
    localStorage.setItem('word_adventure_parent_password', newPassword)
    setSettings(prev => ({ ...prev, passwordProtected: true }))
    setIsSettingPassword(false)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    alert('Password set successfully! 🔒')
  }

  const removePassword = () => {
    localStorage.removeItem('word_adventure_parent_password')
    setSettings(prev => ({ ...prev, passwordProtected: false }))
    alert('Password protection removed! 🔓')
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    localStorage.setItem('word_adventure_settings', JSON.stringify(settings))
    // Show success message
    alert('Settings saved successfully! 🎉')
  }

  const resetAppearanceSettings = () => {
    const defaultAppearance = {
      fontSize: 'medium',
      colorTheme: 'default',
      animationsEnabled: true,
      reducedMotion: false,
      darkMode: false,
      highContrast: false
    }
    
    Object.keys(defaultAppearance).forEach(key => {
      handleSettingChange(key, defaultAppearance[key])
    })
  }

  const resetProgress = () => {
    if (showResetConfirm) {
      // Reset all word progress
      const resetWords = words.map(word => ({ ...word, known: false }))
      setWords(resetWords)
      resetTest()
      localStorage.removeItem('word_adventure_words')
      setShowResetConfirm(false)
      alert('Progress reset successfully! 🔄')
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000)
    }
  }

  const exportProgress = () => {
    const data = {
      words,
      settings,
      testResults,
      exportDate: new Date().toISOString(),
      user: user?.username
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `word-adventure-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportProgressCSV = () => {
    // Create CSV content
    const headers = ['Word', 'Known', 'Difficulty', 'Custom', 'Date Added']
    const csvContent = [
      headers.join(','),
      ...words.map(word => [
        `"${word.word}"`,
        word.known ? 'Yes' : 'No',
        word.difficulty,
        word.isCustom ? 'Yes' : 'No',
        word.dateAdded || 'N/A'
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `word-adventure-progress-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importProgress = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.words) {
            setWords(data.words)
            alert('Progress imported successfully! 📥')
          }
          if (data.settings) {
            setSettings(data.settings)
          }
        } catch (error) {
          alert('Error importing file. Please check the file format. ❌')
        }
      }
      reader.readAsText(file)
    }
  }

  const settingSections = [
    {
      title: 'Profile Settings',
      icon: User,
      items: [
        {
          key: 'childName',
          label: 'Child Name',
          type: 'input',
          value: settings.childName,
          placeholder: 'Enter child name'
        },
        {
          key: 'dailyGoal',
          label: 'Daily Learning Goal',
          type: 'number',
          value: settings.dailyGoal,
          min: 1,
          max: 20,
          description: 'Number of words to learn each day'
        },
        {
          key: 'weeklyGoal',
          label: 'Weekly Learning Goal',
          type: 'number',
          value: settings.weeklyGoal,
          min: 5,
          max: 100,
          description: 'Number of words to learn each week'
        }
      ]
    },
    {
      title: 'Learning Preferences',
      icon: Settings,
      items: [
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          type: 'switch',
          value: settings.soundEnabled,
          description: 'Enable word pronunciation and sound effects'
        },
        {
          key: 'autoPlayAudio',
          label: 'Auto-Play Audio',
          type: 'switch',
          value: settings.autoPlayAudio,
          description: 'Automatically play word pronunciation'
        },
        {
          key: 'repeatAudio',
          label: 'Repeat Audio',
          type: 'switch',
          value: settings.repeatAudio,
          description: 'Play pronunciation multiple times'
        },
        {
          key: 'slowAudio',
          label: 'Slow Audio',
          type: 'switch',
          value: settings.slowAudio,
          description: 'Play pronunciation at slower speed'
        },
        {
          key: 'showPronunciation',
          label: 'Show Pronunciation',
          type: 'switch',
          value: settings.showPronunciation,
          description: 'Display phonetic pronunciation guide'
        },
        {
          key: 'showExamples',
          label: 'Show Examples',
          type: 'switch',
          value: settings.showExamples,
          description: 'Display example sentences for words'
        },
        {
          key: 'showFunFacts',
          label: 'Show Fun Facts',
          type: 'switch',
          value: settings.showFunFacts,
          description: 'Display interesting facts about words'
        },
        {
          key: 'autoAdvance',
          label: 'Auto Advance',
          type: 'switch',
          value: settings.autoAdvance,
          description: 'Automatically move to next word after answering'
        },
        {
          key: 'showDifficulty',
          label: 'Show Difficulty',
          type: 'switch',
          value: settings.showDifficulty,
          description: 'Display difficulty level for each word'
        },
        {
          key: 'showHints',
          label: 'Show Hints',
          type: 'switch',
          value: settings.showHints,
          description: 'Show helpful hints during learning'
        },
        {
          key: 'showEmojis',
          label: 'Show Emojis',
          type: 'switch',
          value: settings.showEmojis,
          description: 'Display emoji images for words'
        }
      ]
    },
    {
      title: 'Quiz Settings',
      icon: Brain,
      items: [
        {
          key: 'quizMode',
          label: 'Quiz Mode',
          type: 'select',
          value: settings.quizMode,
          options: [
            { value: 'mixed', label: 'Mixed Questions' },
            { value: 'recognition', label: 'Word Recognition' },
            { value: 'spelling', label: 'Spelling Practice' },
            { value: 'definition', label: 'Definition Matching' }
          ],
          description: 'Type of quiz questions to present'
        },
        {
          key: 'quizDifficulty',
          label: 'Quiz Difficulty',
          type: 'select',
          value: settings.quizDifficulty,
          options: [
            { value: 'adaptive', label: 'Adaptive (Recommended)' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' }
          ],
          description: 'Difficulty level for quiz questions'
        },
        {
          key: 'questionsPerQuiz',
          label: 'Questions Per Quiz',
          type: 'number',
          value: settings.questionsPerQuiz,
          min: 5,
          max: 25,
          description: 'Number of questions in each quiz session'
        },
        {
          key: 'timeLimit',
          label: 'Time Limit (seconds)',
          type: 'number',
          value: settings.timeLimit,
          min: 0,
          max: 300,
          description: 'Time limit per question (0 = no limit)'
        },
        {
          key: 'showCorrectAnswer',
          label: 'Show Correct Answer',
          type: 'switch',
          value: settings.showCorrectAnswer,
          description: 'Show correct answer when wrong'
        },
        {
          key: 'allowRetries',
          label: 'Allow Retries',
          type: 'switch',
          value: settings.allowRetries,
          description: 'Allow retrying incorrect answers'
        }
      ]
    },
    {
      title: 'Progress & Motivation',
      icon: Trophy,
      items: [
        {
          key: 'showProgress',
          label: 'Show Progress',
          type: 'switch',
          value: settings.showProgress,
          description: 'Display learning progress and statistics'
        },
        {
          key: 'showAchievements',
          label: 'Show Achievements',
          type: 'switch',
          value: settings.showAchievements,
          description: 'Display achievement badges and rewards'
        },
        {
          key: 'enableStreaks',
          label: 'Enable Streaks',
          type: 'switch',
          value: settings.enableStreaks,
          description: 'Track daily learning streaks'
        },
        {
          key: 'celebrateSuccess',
          label: 'Celebrate Success',
          type: 'switch',
          value: settings.celebrateSuccess,
          description: 'Show celebrations for achievements'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'select',
          value: settings.fontSize,
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          description: 'Text size throughout the application'
        },
        {
          key: 'colorTheme',
          label: 'Color Theme',
          type: 'select',
          value: settings.colorTheme,
          options: [
            { value: 'default', label: 'Default (Purple/Pink)' },
            { value: 'blue', label: 'Ocean Blue' },
            { value: 'green', label: 'Nature Green' },
            { value: 'purple', label: 'Royal Purple' },
            { value: 'pink', label: 'Bubblegum Pink' }
          ],
          description: 'Color scheme for the interface'
        },
        {
          key: 'animationsEnabled',
          label: 'Animations',
          type: 'switch',
          value: settings.animationsEnabled,
          description: 'Enable smooth animations and transitions'
        },
        {
          key: 'reducedMotion',
          label: 'Reduced Motion',
          type: 'switch',
          value: settings.reducedMotion,
          description: 'Reduce motion for accessibility'
        },
        {
          key: 'darkMode',
          label: 'Dark Mode',
          type: 'switch',
          value: settings.darkMode,
          description: 'Use dark theme (coming soon)'
        }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Password Protection */}
      {!isAuthenticated && settings.passwordProtected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <CardTitle className="text-xl font-bold flex items-center">
                <Lock className="h-6 w-6 mr-2" />
                Parent Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                This section is password protected. Please enter the parent password to continue.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    placeholder="Enter password"
                    className={passwordError ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </p>
                )}
              </div>
              
              <Button
                onClick={handlePasswordSubmit}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                disabled={!password}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Access Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Settings Content */}
      {isAuthenticated && (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-purple-800 mb-2 text-fun-shadow flex items-center justify-center">
              <Settings className="h-10 w-10 mr-3" />
              Parent Settings 
              <motion.span 
                className="ml-2"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚙️
              </motion.span>
            </h1>
            <p className="text-lg text-purple-600">
              Customize your child's Word Adventure experience
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="bg-white rounded-lg p-1 shadow-lg border">
              <div className="flex space-x-1">
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-2 ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Learning Settings
                </Button>
                <Button
                  variant={activeTab === 'appearance' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('appearance')}
                  className={`px-6 py-2 ${
                    activeTab === 'appearance' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Settings Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 flex items-center">
                  <section.icon className="h-6 w-6 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {item.label}
                        </label>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                      
                      {item.type === 'switch' && (
                        <Switch
                          checked={item.value}
                          onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                        />
                      )}
                      
                      {item.type === 'input' && (
                        <Input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-40"
                        />
                      )}
                      
                      {item.type === 'number' && (
                        <Input
                          type="number"
                          value={item.value}
                          onChange={(e) => handleSettingChange(item.key, parseInt(e.target.value))}
                          min={item.min}
                          max={item.max}
                          className="w-20"
                        />
                      )}
                      
                      {item.type === 'select' && (
                        <Select
                          value={item.value}
                          onValueChange={(value) => handleSettingChange(item.key, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AppearanceSettings
                  settings={settings}
                  onSettingChange={handleSettingChange}
                  onSave={saveSettings}
                  onReset={resetAppearanceSettings}
                />
              </motion.div>
            )}
          </AnimatePresence>

      {/* Password Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Lock className="h-6 w-6 mr-2" />
              Password Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!settings.passwordProtected ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Set a password to protect parent settings from unauthorized access.
                </p>
                
                {!isSettingPassword ? (
                  <Button
                    onClick={() => setIsSettingPassword(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Set Password
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                        />
                      </div>
                    </div>
                    
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {passwordError}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSetPassword}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Set Password
                      </Button>
                      <Button
                        onClick={() => {
                          setIsSettingPassword(false)
                          setNewPassword('')
                          setConfirmPassword('')
                          setPasswordError('')
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">Password protection is enabled</span>
                  </div>
                  <Button
                    onClick={removePassword}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Unlock className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={exportProgress}
                className="btn-fun bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Export JSON
              </Button>
              
              <Button
                onClick={exportProgressCSV}
                className="btn-fun bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <FileText className="h-5 w-5 mr-2" />
                Export CSV
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importProgress}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  className="w-full btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Import Data
                </Button>
              </div>
              
              <Button
                onClick={resetProgress}
                variant={showResetConfirm ? "destructive" : "outline"}
                className={`btn-fun ${
                  showResetConfirm 
                    ? 'bg-red-500 text-white' 
                    : 'border-2 border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {showResetConfirm ? 'Confirm Reset' : 'Reset Progress'}
              </Button>
            </div>
            
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-red-700 text-sm">
                  ⚠️ This will reset all learning progress. Click "Confirm Reset" again to proceed.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Button
          onClick={saveSettings}
          className="btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </Button>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Safety
        </h3>
        <div className="text-sm text-purple-700 space-y-1">
          <p>🔒 All data is stored locally on your device</p>
          <p>🚫 No personal information is shared online</p>
          <p>👨‍👩‍👧‍👦 Designed with child safety in mind</p>
          <p>📱 Works offline after initial load</p>
          <p>🛡️ Password protection available for parent settings</p>
        </div>
      </motion.div>
        </>
      )}
    </div>
  )
}

export default ParentSettings

