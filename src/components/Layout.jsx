import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth, useApp } from '../App'
import { 
  Home, 
  BookOpen, 
  Brain, 
  Trophy, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Star,
  BarChart3
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { words } = useApp()

  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard', emoji: '🏠' },
    { path: '/library', icon: BookOpen, label: 'Word Library', emoji: '📚' },
    { path: '/test', icon: Brain, label: 'Quiz Time', emoji: '🧠' },
    { path: '/results', icon: Trophy, label: 'Results', emoji: '🏆' },
    { path: '/progress', icon: BarChart3, label: 'Progress', emoji: '📊' },
    { path: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' }
  ]

  const knownWords = words.filter(word => word.known).length
  const totalWords = words.length
  const progress = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-purple-200 p-4 flex items-center justify-between">
        <Button
          onClick={() => setSidebarOpen(true)}
          variant="ghost"
          size="sm"
          className="text-purple-700"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <motion.h1 
          className="text-xl font-bold text-purple-800"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌟 Word Adventure
        </motion.h1>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-purple-600">
            {progress}% 🎯
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-sm border-r border-purple-200 lg:relative lg:translate-x-0"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-purple-200">
              <div className="flex items-center justify-between">
                <motion.h1 
                  className="text-2xl font-bold text-purple-800"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌟 Word Adventure
                </motion.h1>
                <Button
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-purple-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* User Info */}
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.avatar || '👤'}
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800">{user?.username}</p>
                    <div className="flex items-center space-x-1 text-sm text-purple-600">
                      <Star className="h-3 w-3" />
                      <span>Level {user?.level || 1}</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-purple-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {knownWords} of {totalWords} words learned
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        navigate(item.path)
                        setSidebarOpen(false)
                      }}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-12 text-left rounded-2xl ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      <span className="text-xl mr-3">{item.emoji}</span>
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  </motion.div>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start h-12 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default Layout

