import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../services/api'

const PasswordReset = ({ onBack }) => {
  const [step, setStep] = useState('request') // 'request', 'verify', 'reset', 'success'
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${api.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResetUrl(data.reset_url) // For demo purposes
        setStep('verify')
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyToken = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${api.baseURL}/auth/verify-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('reset')
      } else {
        setError(data.error || 'Invalid or expired token')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${api.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token.trim(), 
          new_password: newPassword 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('success')
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const extractTokenFromUrl = () => {
    if (resetUrl) {
      const urlParams = new URLSearchParams(resetUrl.split('?')[1])
      const urlToken = urlParams.get('token')
      if (urlToken) {
        setToken(urlToken)
        setStep('reset')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              className="text-6xl mb-4"
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
              {step === 'success' ? '✅' : '🔐'}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-purple-800">
              {step === 'request' && 'Reset Password'}
              {step === 'verify' && 'Check Your Email'}
              {step === 'reset' && 'New Password'}
              {step === 'success' && 'Password Reset!'}
            </CardTitle>
            <CardDescription>
              {step === 'request' && 'Enter your email to receive a reset link'}
              {step === 'verify' && 'We sent you a reset link'}
              {step === 'reset' && 'Enter your new password'}
              {step === 'success' && 'Your password has been updated'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            {step === 'verify' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <p>We've sent a password reset link to <strong>{email}</strong></p>
                  <p className="mt-2">Check your email and click the link to continue.</p>
                </div>
                
                {resetUrl && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                    <p className="font-semibold">Demo Mode:</p>
                    <p className="mt-1">Reset URL: {resetUrl}</p>
                    <Button
                      onClick={extractTokenFromUrl}
                      className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700"
                    >
                      Use Demo Link
                    </Button>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Or enter the token manually:</p>
                  <form onSubmit={handleVerifyToken} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter reset token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="h-12 border-2 border-purple-200 focus:border-purple-400"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      {loading ? 'Verifying...' : 'Verify Token'}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                </motion.div>
                
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">Password Reset Successful!</p>
                  <p className="mt-1">You can now log in with your new password.</p>
                </div>
                
                <Button
                  onClick={onBack}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Back to Login
                </Button>
              </div>
            )}

            {step !== 'success' && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full btn-fun border-2 border-purple-300 text-purple-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PasswordReset

