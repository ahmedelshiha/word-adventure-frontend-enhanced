#!/usr/bin/env python3
"""
Script to initialize the database with 200 words by calling the backend API
"""

import requests
import json

# Backend URL from AGENTS.md
BACKEND_URL = "https://web-production-e17b.up.railway.app"

def check_health():
    """Check if the backend is healthy and get word count"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=30)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy")
            print(f"📊 Current word count: {data.get('word_count', 'Unknown')}")
            return data
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Failed to connect to backend: {str(e)}")
        return None

def initialize_database():
    """Initialize the database by calling the init-db endpoint"""
    try:
        print("🔄 Initializing database...")
        response = requests.post(f"{BACKEND_URL}/api/init-db", timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {data.get('message', 'Database initialized successfully')}")
            return True
        else:
            print(f"❌ Database initialization failed: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ Failed to initialize database: {str(e)}")
        return False

def verify_initialization():
    """Verify that the database now has words"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/words", timeout=30)
        if response.status_code == 200:
            words = response.json()
            print(f"✅ Database now contains {len(words)} words")
            
            # Show some categories
            categories = {}
            for word in words:
                cat = word.get('category', 'unknown')
                categories[cat] = categories.get(cat, 0) + 1
            
            print("📊 Words by category:")
            for cat, count in categories.items():
                print(f"  - {cat}: {count} words")
            
            return len(words) > 0
        else:
            print(f"❌ Failed to fetch words: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Failed to verify initialization: {str(e)}")
        return False

def test_categories():
    """Test the categories endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/categories", timeout=30)
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Available categories: {categories}")
            return True
        else:
            print(f"❌ Failed to fetch categories: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Failed to test categories: {str(e)}")
        return False

def main():
    print("=== Word Adventure Database Initialization ===\n")
    
    # Step 1: Check current status
    print("1. Checking backend health...")
    health_data = check_health()
    if not health_data:
        print("❌ Cannot proceed - backend is not accessible")
        return
    
    current_word_count = health_data.get('word_count', 0)
    print(f"   Current word count: {current_word_count}")
    
    # Step 2: Initialize database if needed
    if current_word_count == 0:
        print("\n2. Database appears empty, initializing...")
        if initialize_database():
            print("   ✅ Database initialization completed")
        else:
            print("   ❌ Database initialization failed")
            return
    else:
        print(f"\n2. Database already has {current_word_count} words")
        print("   Force re-initializing to ensure 200 words are present...")
        if initialize_database():
            print("   ✅ Database re-initialization completed")
        else:
            print("   ❌ Database re-initialization failed")
            return
    
    # Step 3: Verify the result
    print("\n3. Verifying database contents...")
    if verify_initialization():
        print("   ✅ Database verification successful")
    else:
        print("   ❌ Database verification failed")
        return
    
    # Step 4: Test categories endpoint
    print("\n4. Testing categories endpoint...")
    if test_categories():
        print("   ✅ Categories endpoint working")
    else:
        print("   ❌ Categories endpoint failed")
    
    print("\n🎉 Database initialization complete!")
    print(f"🔗 Backend URL: {BACKEND_URL}")
    print("📱 Frontend URL: https://words-adventure.netlify.app")

if __name__ == "__main__":
    main()
