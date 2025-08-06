import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useAuth } from '../App'
import { User, Lock, Sparkles, Mail, UserPlus } from 'lucide-react'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isRegistering) {
      // Registration validation
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters long')
        setLoading(false)
        return
      }

      const result = await register({
        username: username.trim(),
        password,
        email: email.trim() || undefined
      })
      
      if (!result.success) {
        setError(result.error)
      }
    } else {
      // Login
      const result = await login(username, password)
      
      if (!result.success) {
        setError(result.error)
      }
    }
    
    setLoading(false)
  }

  const demoLogin = () => {
    setUsername('demo')
    setPassword('password')
    setIsRegistering(false)
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    setError('')
    setUsername('')
    setPassword('')
    setEmail('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🌟', '🎈', '🦄', '🌈', '🎨', '🎭'][i]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
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
              🌟
            </motion.div>
            <CardTitle className="text-3xl font-bold text-purple-800 text-fun-shadow">
              Word Adventure
            </CardTitle>
            <CardDescription className="text-lg text-purple-600">
              Let's learn new words together! 🚀
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                    <Input
                      type="email"
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                  <Input
                    type="password"
                    placeholder={isRegistering ? "Create a password" : "Secret word"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-semibold btn-fun bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    {isRegistering ? <UserPlus className="h-5 w-5 mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                    {isRegistering ? 'Create Account!' : 'Start Adventure!'}
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <Button
                type="button"
                variant="ghost"
                onClick={toggleMode}
                className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
              >
                {isRegistering ? 'Already have an account? Sign in!' : 'New to Word Adventure? Create account!'}
              </Button>
              
              <p className="text-sm text-purple-600">
                Want to try first?
              </p>
              <Button
                onClick={demoLogin}
                variant="outline"
                className="btn-fun border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                🎮 Try Demo
              </Button>
            </div>

            <div className="text-center text-xs text-purple-500">
              <p>🎯 Learn • 🏆 Play • 🌟 Grow</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage

