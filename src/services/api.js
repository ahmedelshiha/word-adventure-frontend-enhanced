/**
 * API Service Layer for Word Adventure
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class WordAdventureAPI {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('admin_token')
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
      
      return response
    } catch (error) {
      console.error('Registration failed:', error.message)
      throw error
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      if (response.user) {
        // Store user data for session management
        localStorage.setItem('currentUser', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      // Fallback to demo login if API is not available
      console.warn('API login failed, using demo mode:', error.message)
      return this.demoLogin(credentials)
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.warn('API logout failed:', error.message)
    } finally {
      this.token = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('currentUser')
    }
  }

  // Demo login for offline/development mode
  demoLogin(credentials) {
    if (credentials.username === 'demo' && credentials.password === 'password') {
      const demoUser = {
        id: 1,
        username: 'demo',
        email: 'demo@wordadventure.com',
        level: 5,
        xp: 1250,
        words_learned: 45,
        current_streak: 7,
        best_streak: 12,
        total_tests_taken: 23,
        progress_data: {
          easy: { learned: 20, total: 30 },
          medium: { learned: 15, total: 25 },
          hard: { learned: 10, total: 20 }
        },
        settings: {
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false,
          soundEnabled: true
        },
        achievements: ['first_word', 'streak_5', 'level_5'],
        virtual_pet: {
          name: 'Buddy',
          type: 'cat',
          happiness: 85,
          growth: 65,
          accessories: ['hat', 'bow'],
          lastFed: Date.now() - 3600000 // 1 hour ago
        },
        isDemo: true
      }
      
      localStorage.setItem('currentUser', JSON.stringify(demoUser))
      return { success: true, user: demoUser, message: 'Demo login successful' }
    }
    throw new Error('Invalid credentials')
  }

  // Get current user
  getCurrentUser() {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  }

  // Word operations
  async getWords(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.user_id) params.append('user_id', filters.user_id)

      const endpoint = `/words${params.toString() ? '?' + params.toString() : ''}`
      return await this.request(endpoint)
    } catch (error) {
      console.warn('Failed to fetch words from API, using local data')
      return this.getDemoWords()
    }
  }

  async getRandomWords(count = 10, filters = {}) {
    try {
      const params = new URLSearchParams()
      params.append('count', count.toString())
      if (filters.category) params.append('category', filters.category)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.user_id) params.append('user_id', filters.user_id)

      return await this.request(`/words/random?${params.toString()}`)
    } catch (error) {
      console.warn('Failed to fetch random words from API, using local data')
      const allWords = this.getDemoWords()
      const shuffled = allWords.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }
  }

  getDemoWords() {
    return [
      {
        id: 1,
        word: 'apple',
        pronunciation: '/ˈæpəl/',
        definition: 'A round fruit with red or green skin',
        example: 'I eat an apple for breakfast',
        fun_fact: 'Apples float because they are 25% air!',
        emoji: '🍎',
        category: 'food',
        difficulty: 'easy'
      },
      {
        id: 2,
        word: 'banana',
        pronunciation: '/bəˈnænə/',
        definition: 'A long yellow fruit',
        example: 'Monkeys love to eat bananas',
        fun_fact: 'Bananas are berries, but strawberries are not!',
        emoji: '🍌',
        category: 'food',
        difficulty: 'easy'
      },
      {
        id: 3,
        word: 'cat',
        pronunciation: '/kæt/',
        definition: 'A small furry pet animal that meows',
        example: 'My cat likes to sleep in the sun',
        fun_fact: 'Cats spend 70% of their lives sleeping!',
        emoji: '🐱',
        category: 'animals',
        difficulty: 'easy'
      },
      {
        id: 4,
        word: 'dog',
        pronunciation: '/dɔːɡ/',
        definition: 'A friendly pet animal that barks',
        example: 'Dogs are loyal companions',
        fun_fact: 'Dogs can learn over 150 words!',
        emoji: '🐶',
        category: 'animals',
        difficulty: 'easy'
      },
      {
        id: 5,
        word: 'elephant',
        pronunciation: '/ˈeləfənt/',
        definition: 'A large gray animal with a long trunk',
        example: 'Elephants are the largest land animals',
        fun_fact: 'Elephants can remember friends after decades!',
        emoji: '🐘',
        category: 'animals',
        difficulty: 'medium'
      }
    ]
  }

  async createWord(word) {
    try {
      return await this.request('/words', {
        method: 'POST',
        body: JSON.stringify(word)
      })
    } catch (error) {
      console.warn('Failed to create word via API:', error.message)
      throw error
    }
  }

  async updateWord(id, updates) {
    try {
      return await this.request(`/words/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    } catch (error) {
      console.warn('Failed to update word via API:', error.message)
      throw error
    }
  }

  async deleteWord(id) {
    try {
      return await this.request(`/words/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.warn('Failed to delete word via API:', error.message)
      throw error
    }
  }

  // User progress operations
  async getUserProgress(userId) {
    try {
      return await this.request(`/users/${userId}/progress`)
    } catch (error) {
      console.warn('Failed to fetch user progress from API')
      return null
    }
  }

  async updateUserProgress(userId, progressData) {
    try {
      return await this.request(`/users/${userId}/progress`, {
        method: 'PUT',
        body: JSON.stringify(progressData)
      })
    } catch (error) {
      console.warn('Failed to update user progress via API:', error.message)
      // Continue with local storage fallback
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        Object.assign(currentUser, progressData)
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
      return null
    }
  }

  async saveTestResult(userId, testData) {
    try {
      return await this.request(`/users/${userId}/test-results`, {
        method: 'POST',
        body: JSON.stringify(testData)
      })
    } catch (error) {
      console.warn('Failed to save test result via API:', error.message)
      // Store locally for offline mode
      const offlineResults = JSON.parse(localStorage.getItem('offlineTestResults') || '[]')
      const result = { ...testData, id: Date.now(), userId, completed_at: new Date().toISOString() }
      offlineResults.push(result)
      localStorage.setItem('offlineTestResults', JSON.stringify(offlineResults))
      return { success: true, result }
    }
  }

  // Analytics operations
  async getAnalytics() {
    try {
      return await this.request('/analytics')
    } catch (error) {
      console.warn('Failed to fetch analytics from API')
      return null
    }
  }

  async trackEvent(eventData) {
    try {
      return await this.request('/analytics/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      })
    } catch (error) {
      console.warn('Failed to track event via API:', error.message)
      // Continue silently for analytics
      return null
    }
  }

  // Category operations
  async getCategories() {
    try {
      const response = await this.request('/categories')
      if (response && response.categories) {
        return response.categories
      }
      return response || []
    } catch (error) {
      console.warn('Failed to fetch categories from API, using local data')
      // Import local categories data as fallback
      const { enhancedCategories } = await import('../data/wordsDatabase.js')
      return enhancedCategories || []
    }
  }

  async getDifficulties() {
    try {
      return await this.request('/difficulties')
    } catch (error) {
      console.warn('Failed to fetch difficulties from API, using local data')
      return ['easy', 'medium', 'hard']
    }
  }

  async createCategory(category) {
    try {
      return await this.request('/categories', {
        method: 'POST',
        body: JSON.stringify(category)
      })
    } catch (error) {
      console.warn('Failed to create category via API:', error.message)
      throw error
    }
  }

  // Bulk operations
  async bulkImportWords(wordsData) {
    try {
      return await this.request('/words/bulk', {
        method: 'POST',
        body: JSON.stringify({ words: wordsData })
      })
    } catch (error) {
      console.warn('Failed to bulk import words via API:', error.message)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health')
      return { status: 'online', ...response }
    } catch (error) {
      return { status: 'offline', error: error.message }
    }
  }
}

// Create singleton instance
const api = new WordAdventureAPI()

export default api

// Export individual methods for convenience
export const {
  register,
  login,
  logout,
  getCurrentUser,
  getWords,
  getRandomWords,
  createWord,
  updateWord,
  deleteWord,
  getUserProgress,
  updateUserProgress,
  saveTestResult,
  getAnalytics,
  trackEvent,
  getCategories,
  getDifficulties,
  createCategory,
  bulkImportWords,
  healthCheck
} = api
