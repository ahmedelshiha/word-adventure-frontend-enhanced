// Test script to initialize categories in the backend
async function testCategories() {
  const API_BASE_URL = 'https://web-production-3b1f.up.railway.app/api'
  
  try {
    console.log('Testing backend health...')
    const healthResponse = await fetch(`${API_BASE_URL}/health`)
    const healthData = await healthResponse.json()
    console.log('Backend health:', healthData)
    
    console.log('Initializing categories...')
    const initResponse = await fetch(`${API_BASE_URL}/init-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const initData = await initResponse.json()
    console.log('Categories initialization:', initData)
    
    console.log('Fetching categories...')
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
    const categoriesData = await categoriesResponse.json()
    console.log('Categories:', categoriesData)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testCategories()
