import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='../dist')

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
jwt = JWTManager(app)
CORS(app, origins="*")  # Allow all origins for development

# Database setup
DATABASE = 'word_adventure.db'

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT,
            password_hash TEXT,
            age_group TEXT DEFAULT 'child',
            parent_email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            streak INTEGER DEFAULT 0,
            last_play_date TEXT,
            total_words_learned INTEGER DEFAULT 0,
            total_quizzes_taken INTEGER DEFAULT 0,
            perfect_scores INTEGER DEFAULT 0
        )
    ''')
    
    # Words table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY,
            word TEXT NOT NULL,
            image TEXT,
            pronunciation TEXT,
            definition TEXT,
            example TEXT,
            fun_fact TEXT,
            difficulty TEXT DEFAULT 'easy',
            category TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User word progress table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_word_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            word_id INTEGER,
            known BOOLEAN DEFAULT FALSE,
            mastery_level INTEGER DEFAULT 0,
            last_practiced TIMESTAMP,
            correct_attempts INTEGER DEFAULT 0,
            total_attempts INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (word_id) REFERENCES words (id),
            UNIQUE(user_id, word_id)
        )
    ''')
    
    # Quiz results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            word_id INTEGER,
            remembered BOOLEAN,
            quiz_type TEXT DEFAULT 'basic',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (word_id) REFERENCES words (id)
        )
    ''')
    
    # Achievements table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            achievement_id TEXT,
            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, achievement_id)
        )
    ''')
    
    # Virtual pet table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS virtual_pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            name TEXT DEFAULT 'Buddy',
            type TEXT DEFAULT 'cat',
            happiness INTEGER DEFAULT 100,
            growth INTEGER DEFAULT 0,
            accessories TEXT DEFAULT '[]',
            last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            emoji TEXT,
            color TEXT,
            description TEXT,
            subcategories TEXT DEFAULT '[]',
            is_custom BOOLEAN DEFAULT FALSE
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def populate_sample_data():
    """Populate database with sample words and categories"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM words')
    if cursor.fetchone()[0] > 0:
        conn.close()
        return
    
    # Sample categories
    categories = [
        ('food', 'Food & Drinks', '🍎', 'from-red-400 to-orange-400', 'Learn about delicious foods and drinks', '["fruits", "vegetables", "meals", "snacks", "drinks"]', False),
        ('animals', 'Animals', '🐱', 'from-green-400 to-blue-400', 'Discover amazing animals from around the world', '["pets", "farm animals", "wild animals", "sea creatures", "insects"]', False),
        ('objects', 'Objects & Things', '🏠', 'from-purple-400 to-pink-400', 'Learn about everyday objects and items', '["furniture", "electronics", "tools", "vehicles", "household items"]', False),
        ('nature', 'Nature & Weather', '🌳', 'from-green-400 to-emerald-400', 'Explore the natural world around us', '["plants", "weather", "landscapes", "sky objects", "natural phenomena"]', False),
        ('body', 'Body Parts', '👁️', 'from-yellow-400 to-red-400', 'Learn about parts of the human body', '["face", "limbs", "senses", "internal organs", "body systems"]', False),
        ('colors', 'Colors', '🌈', 'from-pink-400 to-purple-400', 'Discover the wonderful world of colors', '["primary colors", "secondary colors", "shades", "patterns", "color mixing"]', False),
        ('numbers', 'Numbers & Math', '🔢', 'from-blue-400 to-indigo-400', 'Learn numbers and basic math concepts', '["counting", "basic math", "shapes", "measurements", "time"]', False),
        ('actions', 'Actions & Verbs', '🏃', 'from-orange-400 to-red-400', 'Learn about different actions and movements', '["movement", "daily activities", "sports actions", "creative actions", "communication"]', False)
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO categories (id, name, emoji, color, description, subcategories, is_custom)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', categories)
    
    # Sample words (first 50 from the database)
    sample_words = [
        (1, 'Apple', '🍎', '/ˈæpəl/', 'A round fruit with red or green skin', 'I eat an apple for breakfast', 'Apples float because they are 25% air!', 'easy', 'food'),
        (2, 'Banana', '🍌', '/bəˈnænə/', 'A long yellow fruit', 'Monkeys love to eat bananas', 'Bananas are berries, but strawberries are not!', 'easy', 'food'),
        (3, 'Orange', '🍊', '/ˈɔːrɪndʒ/', 'A round citrus fruit', 'Orange juice is delicious', 'Oranges were originally green!', 'easy', 'food'),
        (4, 'Cat', '🐱', '/kæt/', 'A small furry pet that says meow', 'My cat loves to play with yarn', 'Cats sleep 12-16 hours per day!', 'easy', 'animals'),
        (5, 'Dog', '🐶', '/dɔːɡ/', 'A loyal pet that barks and wags its tail', 'Dogs are man\'s best friend', 'Dogs can learn over 150 words!', 'easy', 'animals'),
        (6, 'House', '🏠', '/haʊs/', 'A building where people live', 'My house has a red door', 'The oldest house is 9,000 years old!', 'easy', 'objects'),
        (7, 'Tree', '🌳', '/triː/', 'A tall plant with branches and leaves', 'Birds build nests in trees', 'The oldest tree is over 4,800 years old!', 'easy', 'nature'),
        (8, 'Eye', '👁️', '/aɪ/', 'The part of your body you see with', 'I have two brown eyes', 'Your eyes blink 15-20 times per minute!', 'easy', 'body'),
        (9, 'Red', '🔴', '/red/', 'The color of fire and strawberries', 'Stop signs are red', 'Red is the first color babies can see!', 'easy', 'colors'),
        (10, 'One', '1️⃣', '/wʌn/', 'The first number', 'I have one nose', 'One is the only number spelled with letters in reverse alphabetical order!', 'easy', 'numbers'),
        (11, 'Run', '🏃', '/rʌn/', 'To move very fast with your legs', 'I run to catch the bus', 'Humans can run up to 28 miles per hour!', 'easy', 'actions'),
        (12, 'Elephant', '🐘', '/ˈeləfənt/', 'A huge gray animal with a long trunk', 'Elephants never forget', 'Elephants can\'t jump!', 'medium', 'animals'),
        (13, 'Butterfly', '🦋', '/ˈbʌtərflaɪ/', 'A colorful insect with beautiful wings', 'Butterflies start as caterpillars', 'Butterflies taste with their feet!', 'medium', 'animals'),
        (14, 'Airplane', '✈️', '/ˈerpleɪn/', 'A flying machine with wings', 'Airplanes fly high in the sky', 'The Wright brothers flew for 12 seconds!', 'medium', 'objects'),
        (15, 'Rainbow', '🌈', '/ˈreɪnboʊ/', 'Colorful arc in the sky after rain', 'Rainbows have seven colors', 'You can never reach the end of a rainbow!', 'medium', 'nature'),
        (16, 'Knee', '🦵', '/niː/', 'The joint in the middle of your leg', 'I bend my knee to sit down', 'Your kneecap is your body\'s largest sesamoid bone!', 'medium', 'body'),
        (17, 'Purple', '🟣', '/ˈpɜːrpəl/', 'The color of grapes and violets', 'My favorite crayon is purple', 'Purple used to be the most expensive color!', 'easy', 'colors'),
        (18, 'Seven', '7️⃣', '/ˈsevən/', 'The number after six', 'There are seven days in a week', 'Seven is the most popular lucky number!', 'easy', 'numbers'),
        (19, 'Dance', '💃', '/dæns/', 'To move your body to music', 'I love to dance to my favorite songs', 'Dancing makes your brain happy!', 'easy', 'actions'),
        (20, 'Jellyfish', '🪼', '/ˈdʒelifɪʃ/', 'A sea creature that looks like jelly', 'Jellyfish have no brain or heart', 'Some jellyfish are immortal!', 'hard', 'animals')
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO words (id, word, image, pronunciation, definition, example, fun_fact, difficulty, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_words)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()
populate_sample_data()

# API Routes

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email', '')
    password = data.get('password', 'demo123')  # Default password for demo
    age_group = data.get('age_group', 'child')
    parent_email = data.get('parent_email', '')
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Username already exists'}), 400
    
    # Create new user
    password_hash = generate_password_hash(password)
    cursor.execute('''
        INSERT INTO users (username, email, password_hash, age_group, parent_email)
        VALUES (?, ?, ?, ?, ?)
    ''', (username, email, password_hash, age_group, parent_email))
    
    user_id = cursor.lastrowid
    
    # Create virtual pet for the user
    cursor.execute('''
        INSERT INTO virtual_pets (user_id, name, type)
        VALUES (?, ?, ?)
    ''', (user_id, 'Buddy', 'cat'))
    
    conn.commit()
    conn.close()
    
    # Create access token
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user_id,
            'username': username,
            'email': email,
            'age_group': age_group
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password', 'demo123')
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find user
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    
    if not user:
        # Auto-register for demo purposes
        password_hash = generate_password_hash(password)
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, age_group)
            VALUES (?, ?, ?, ?)
        ''', (username, f'{username}@wordadventure.com', password_hash, 'child'))
        
        user_id = cursor.lastrowid
        
        # Create virtual pet
        cursor.execute('''
            INSERT INTO virtual_pets (user_id, name, type)
            VALUES (?, ?, ?)
        ''', (user_id, 'Buddy', 'cat'))
        
        conn.commit()
        
        # Fetch the new user
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
    
    # Update last login
    cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', 
                   (datetime.now(), user['id']))
    conn.commit()
    conn.close()
    
    # Create access token
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'age_group': user['age_group'],
            'xp': user['xp'],
            'level': user['level'],
            'streak': user['streak']
        }
    })

@app.route('/api/words', methods=['GET'])
@jwt_required()
def get_words():
    """Get all words with user progress"""
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get words with user progress
    cursor.execute('''
        SELECT w.*, COALESCE(uwp.known, 0) as known, 
               COALESCE(uwp.mastery_level, 0) as mastery_level
        FROM words w
        LEFT JOIN user_word_progress uwp ON w.id = uwp.word_id AND uwp.user_id = ?
        ORDER BY w.word
    ''', (user_id,))
    
    words = []
    for row in cursor.fetchall():
        words.append({
            'id': row['id'],
            'word': row['word'],
            'image': row['image'],
            'pronunciation': row['pronunciation'],
            'definition': row['definition'],
            'example': row['example'],
            'funFact': row['fun_fact'],
            'difficulty': row['difficulty'],
            'category': row['category'],
            'known': bool(row['known']),
            'masteryLevel': row['mastery_level']
        })
    
    conn.close()
    return jsonify(words)

@app.route('/api/words/<int:word_id>/progress', methods=['PUT'])
@jwt_required()
def update_word_progress():
    """Update user's progress on a word"""
    user_id = get_jwt_identity()
    word_id = request.view_args['word_id']
    data = request.get_json()
    
    known = data.get('known', False)
    mastery_level = data.get('mastery_level', 0)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Update or insert progress
    cursor.execute('''
        INSERT OR REPLACE INTO user_word_progress 
        (user_id, word_id, known, mastery_level, last_practiced)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, word_id, known, mastery_level, datetime.now()))
    
    # Update user stats if word was learned
    if known:
        cursor.execute('''
            UPDATE users SET 
                total_words_learned = (
                    SELECT COUNT(*) FROM user_word_progress 
                    WHERE user_id = ? AND known = 1
                ),
                xp = xp + 10
            WHERE id = ?
        ''', (user_id, user_id))
        
        # Update level based on XP
        cursor.execute('SELECT xp FROM users WHERE id = ?', (user_id,))
        xp = cursor.fetchone()['xp']
        new_level = (xp // 100) + 1
        cursor.execute('UPDATE users SET level = ? WHERE id = ?', (new_level, user_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/quiz/submit', methods=['POST'])
@jwt_required()
def submit_quiz_result():
    """Submit quiz result"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    word_id = data.get('word_id')
    remembered = data.get('remembered', False)
    quiz_type = data.get('quiz_type', 'basic')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Insert quiz result
    cursor.execute('''
        INSERT INTO quiz_results (user_id, word_id, remembered, quiz_type)
        VALUES (?, ?, ?, ?)
    ''', (user_id, word_id, remembered, quiz_type))
    
    # Update user stats
    xp_gained = 15 if remembered else 5
    cursor.execute('''
        UPDATE users SET 
            total_quizzes_taken = total_quizzes_taken + 1,
            xp = xp + ?
        WHERE id = ?
    ''', (xp_gained, user_id))
    
    # Update level
    cursor.execute('SELECT xp FROM users WHERE id = ?', (user_id,))
    xp = cursor.fetchone()['xp']
    new_level = (xp // 100) + 1
    cursor.execute('UPDATE users SET level = ? WHERE id = ?', (new_level, user_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'xp_gained': xp_gained})

@app.route('/api/user/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get user statistics"""
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user stats
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    # Get achievements
    cursor.execute('SELECT achievement_id FROM user_achievements WHERE user_id = ?', (user_id,))
    achievements = [row['achievement_id'] for row in cursor.fetchall()]
    
    # Get virtual pet
    cursor.execute('SELECT * FROM virtual_pets WHERE user_id = ?', (user_id,))
    pet = cursor.fetchone()
    
    conn.close()
    
    return jsonify({
        'user': {
            'id': user['id'],
            'username': user['username'],
            'xp': user['xp'],
            'level': user['level'],
            'streak': user['streak'],
            'totalWordsLearned': user['total_words_learned'],
            'totalQuizzesTaken': user['total_quizzes_taken'],
            'perfectScores': user['perfect_scores'],
            'achievements': achievements
        },
        'virtualPet': {
            'name': pet['name'],
            'type': pet['type'],
            'happiness': pet['happiness'],
            'growth': pet['growth'],
            'accessories': json.loads(pet['accessories']),
            'lastFed': pet['last_fed']
        } if pet else None
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM categories ORDER BY name')
    categories = []
    for row in cursor.fetchall():
        categories.append({
            'id': row['id'],
            'name': row['name'],
            'emoji': row['emoji'],
            'color': row['color'],
            'description': row['description'],
            'subcategories': json.loads(row['subcategories']),
            'isCustom': bool(row['is_custom'])
        })
    
    conn.close()
    return jsonify(categories)

@app.route('/api/pet/feed', methods=['POST'])
@jwt_required()
def feed_pet():
    """Feed virtual pet"""
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE virtual_pets SET 
            happiness = MIN(100, happiness + 15),
            last_fed = ?
        WHERE user_id = ?
    ''', (datetime.now(), user_id))
    
    # Add XP for pet care
    cursor.execute('UPDATE users SET xp = xp + 5 WHERE id = ?', (user_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/pet/play', methods=['POST'])
@jwt_required()
def play_with_pet():
    """Play with virtual pet"""
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE virtual_pets SET 
            happiness = MIN(100, happiness + 10),
            growth = MIN(100, growth + 5)
        WHERE user_id = ?
    ''', (user_id,))
    
    # Add XP for pet play
    cursor.execute('UPDATE users SET xp = xp + 5 WHERE id = ?', (user_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'message': 'Enhanced Word Adventure API is running',
        'version': '2.0.0'
    })

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React app"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

