import os
from flask import Flask, send_from_directory, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__, static_folder='../dist')

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for demo

# Initialize extensions
jwt = JWTManager(app)
CORS(app, origins="*")  # Allow all origins for development

# Sample data for demo
sample_words = [
    {"id": 1, "word": "Apple", "image": "🍎", "known": False, "difficulty": "easy"},
    {"id": 2, "word": "Banana", "image": "🍌", "known": False, "difficulty": "easy"},
    {"id": 3, "word": "Cat", "image": "🐱", "known": True, "difficulty": "easy"},
    {"id": 4, "word": "Dog", "image": "🐶", "known": True, "difficulty": "easy"},
    {"id": 5, "word": "Elephant", "image": "🐘", "known": False, "difficulty": "medium"},
    {"id": 6, "word": "Fish", "image": "🐟", "known": False, "difficulty": "easy"},
    {"id": 7, "word": "Giraffe", "image": "🦒", "known": False, "difficulty": "medium"},
    {"id": 8, "word": "House", "image": "🏠", "known": True, "difficulty": "easy"},
    {"id": 9, "word": "Ice cream", "image": "🍦", "known": True, "difficulty": "easy"},
    {"id": 10, "word": "Jellyfish", "image": "🪼", "known": False, "difficulty": "hard"}
]

# API Routes
@app.route('/api/words', methods=['GET'])
def get_words():
    """Get all words"""
    return jsonify(sample_words)

@app.route('/api/words/<int:word_id>', methods=['PUT'])
def update_word(word_id):
    """Update word status"""
    # In a real app, this would update the database
    for word in sample_words:
        if word['id'] == word_id:
            word['known'] = not word['known']
            return jsonify(word)
    return jsonify({'error': 'Word not found'}), 404

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Demo login endpoint"""
    return jsonify({
        'access_token': 'demo_token_12345',
        'user': {
            'id': 1,
            'username': 'demo_user',
            'email': 'demo@wordadventure.com'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Word Adventure API is running'})

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

