from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.word import Word, UserProgress
from src.models.admin import Admin
from src.database import db
from datetime import datetime

words_bp = Blueprint('words', __name__)

@words_bp.route('/words', methods=['GET'])
@jwt_required()
def get_words():
    """Get all words with optional filtering"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get query parameters
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        language = request.args.get('language')
        search = request.args.get('search')
        
        # Build query
        query = Word.query
        
        if category:
            query = query.filter(Word.category == category)
        if difficulty:
            query = query.filter(Word.difficulty == difficulty)
        if language:
            query = query.filter(Word.language == language)
        if search:
            query = query.filter(Word.word.contains(search))
        
        words = query.order_by(Word.created_at.desc()).all()
        
        return jsonify({
            'words': [word.to_dict() for word in words],
            'total': len(words)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words', methods=['POST'])
@jwt_required()
def create_word():
    """Create a new word"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        if not data or not data.get('word'):
            return jsonify({'error': 'Word is required'}), 400
        
        # Check if word already exists
        existing_word = Word.query.filter_by(word=data['word'].lower()).first()
        if existing_word:
            return jsonify({'error': 'Word already exists'}), 400
        
        # Create new word
        word = Word(
            word=data['word'].lower(),
            image_url=data.get('image_url', ''),
            category=data.get('category', 'general'),
            difficulty=data.get('difficulty', 'beginner'),
            language=data.get('language', 'english'),
            description=data.get('description', '')
        )
        
        db.session.add(word)
        db.session.commit()
        
        return jsonify({
            'message': 'Word created successfully',
            'word': word.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words/<int:word_id>', methods=['GET'])
@jwt_required()
def get_word(word_id):
    """Get a specific word"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        word = Word.query.get_or_404(word_id)
        return jsonify({'word': word.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words/<int:word_id>', methods=['PUT'])
@jwt_required()
def update_word(word_id):
    """Update a word"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        word = Word.query.get_or_404(word_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'word' in data:
            word.word = data['word'].lower()
        if 'image_url' in data:
            word.image_url = data['image_url']
        if 'category' in data:
            word.category = data['category']
        if 'difficulty' in data:
            word.difficulty = data['difficulty']
        if 'language' in data:
            word.language = data['language']
        if 'description' in data:
            word.description = data['description']
        
        word.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Word updated successfully',
            'word': word.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words/<int:word_id>', methods=['DELETE'])
@jwt_required()
def delete_word(word_id):
    """Delete a word"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        word = Word.query.get_or_404(word_id)
        
        # Delete associated progress records
        UserProgress.query.filter_by(word_id=word_id).delete()
        
        db.session.delete(word)
        db.session.commit()
        
        return jsonify({'message': 'Word deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words/bulk-import', methods=['POST'])
@jwt_required()
def bulk_import_words():
    """Bulk import words from JSON"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        if not data or not data.get('words'):
            return jsonify({'error': 'Words array is required'}), 400
        
        created_words = []
        errors = []
        
        for word_data in data['words']:
            try:
                if not word_data.get('word'):
                    errors.append(f"Word is required for entry: {word_data}")
                    continue
                
                # Check if word already exists
                existing_word = Word.query.filter_by(word=word_data['word'].lower()).first()
                if existing_word:
                    errors.append(f"Word '{word_data['word']}' already exists")
                    continue
                
                # Create new word
                word = Word(
                    word=word_data['word'].lower(),
                    image_url=word_data.get('image_url', ''),
                    category=word_data.get('category', 'general'),
                    difficulty=word_data.get('difficulty', 'beginner'),
                    language=word_data.get('language', 'english'),
                    description=word_data.get('description', '')
                )
                
                db.session.add(word)
                created_words.append(word_data['word'])
                
            except Exception as e:
                errors.append(f"Error processing word '{word_data.get('word', 'unknown')}': {str(e)}")
        
        db.session.commit()
        
        return jsonify({
            'message': f'Bulk import completed. {len(created_words)} words created.',
            'created_words': created_words,
            'errors': errors
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@words_bp.route('/words/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all unique categories"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        categories = db.session.query(Word.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

