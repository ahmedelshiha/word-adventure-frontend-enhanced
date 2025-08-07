import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const CategoryInitializer = () => {
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')
  const [categoriesData, setCategoriesData] = useState(null)

  const initializeCategories = async () => {
    setStatus('loading')
    setMessage('Initializing categories...')

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-production-3b1f.up.railway.app/api'
      
      // First check backend health
      const healthResponse = await fetch(`${API_BASE_URL}/health`)
      if (!healthResponse.ok) {
        throw new Error('Backend is not responding')
      }
      
      // Initialize categories
      const initResponse = await fetch(`${API_BASE_URL}/init-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!initResponse.ok) {
        const errorData = await initResponse.json()
        throw new Error(errorData.message || 'Failed to initialize categories')
      }
      
      const initData = await initResponse.json()
      
      // Fetch the initialized categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories after initialization')
      }
      
      const categoriesResult = await categoriesResponse.json()
      setCategoriesData(categoriesResult)
      
      setStatus('success')
      setMessage(`✅ Successfully initialized ${categoriesResult.categories?.length || 0} categories`)
      
      // Trigger a page refresh to reload categories in the main app
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error.message}`)
      console.error('Category initialization error:', error)
    }
  }

  const testCategories = async () => {
    setStatus('loading')
    setMessage('Testing categories API...')

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-production-3b1f.up.railway.app/api'
      
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setCategoriesData(data)
      
      setStatus('success')
      setMessage(`✅ Found ${data.categories?.length || 0} categories in database`)
      
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error.message}`)
      console.error('Category test error:', error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔧</span>
          Category Management Utility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testCategories}
            disabled={status === 'loading'}
            variant="outline"
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Categories API
          </Button>
          
          <Button 
            onClick={initializeCategories}
            disabled={status === 'loading'}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Initialize Categories
          </Button>
        </div>
        
        {message && (
          <Alert className={status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-500' : ''}>
            <div className="flex items-center gap-2">
              {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              <AlertDescription>{message}</AlertDescription>
            </div>
          </Alert>
        )}
        
        {categoriesData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">API Response:</h4>
            <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-40">
              {JSON.stringify(categoriesData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CategoryInitializer
