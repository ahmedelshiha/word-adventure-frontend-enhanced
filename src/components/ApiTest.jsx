import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [words, setWords] = useState(null)
  const [categories, setCategories] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    setLoading(true)
    const newErrors = {}

    // Test health endpoint
    try {
      const health = await api.healthCheck()
      setHealthStatus(health)
    } catch (error) {
      newErrors.health = error.message
    }

    // Test words endpoint
    try {
      const wordsData = await api.getWords()
      setWords(wordsData)
    } catch (error) {
      newErrors.words = error.message
    }

    // Test categories endpoint
    try {
      const categoriesData = await api.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      newErrors.categories = error.message
    }

    setErrors(newErrors)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
        <p>Testing API connection...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <div className="grid gap-4">
        {/* Health Check */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg">Health Check</h3>
          {errors.health ? (
            <div className="text-red-600 mt-2">
              <p>❌ Error: {errors.health}</p>
            </div>
          ) : (
            <div className="text-green-600 mt-2">
              <p>✅ Status: {healthStatus?.status}</p>
              {healthStatus?.word_count && (
                <p>📊 Words in database: {healthStatus.word_count}</p>
              )}
            </div>
          )}
        </div>

        {/* Words Test */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg">Words Endpoint</h3>
          {errors.words ? (
            <div className="text-red-600 mt-2">
              <p>❌ Error: {errors.words}</p>
            </div>
          ) : (
            <div className="text-green-600 mt-2">
              <p>✅ Words loaded: {words?.length || 0}</p>
              {words?.slice(0, 3).map(word => (
                <p key={word.id} className="text-sm">• {word.word} ({word.category})</p>
              ))}
            </div>
          )}
        </div>

        {/* Categories Test */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg">Categories Endpoint</h3>
          {errors.categories ? (
            <div className="text-red-600 mt-2">
              <p>❌ Error: {errors.categories}</p>
            </div>
          ) : (
            <div className="text-green-600 mt-2">
              <p>✅ Categories loaded: {categories?.length || 0}</p>
              {categories?.slice(0, 5).map((cat, idx) => (
                <p key={idx} className="text-sm">• {typeof cat === 'string' ? cat : cat.name || cat.id}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button 
          onClick={testApiConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry Tests
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold">API Configuration</h4>
        <p className="text-sm">Base URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</p>
      </div>
    </div>
  )
}
