from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.admin import Admin
from src.models.user import User
from src.models.word import Word, UserProgress
from src.database import db
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/overview', methods=['GET'])
@jwt_required()
def get_overview():
    """Get overview analytics for dashboard"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get basic counts
        total_words = Word.query.count()
        total_users = User.query.count()
        total_progress_records = UserProgress.query.count()
        
        # Get words by category
        words_by_category = db.session.query(
            Word.category,
            func.count(Word.id).label('count')
        ).group_by(Word.category).all()
        
        # Get words by difficulty
        words_by_difficulty = db.session.query(
            Word.difficulty,
            func.count(Word.id).label('count')
        ).group_by(Word.difficulty).all()
        
        # Get recent activity (words created in last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_words = Word.query.filter(Word.created_at >= seven_days_ago).count()
        
        # Get user progress statistics
        known_words_count = UserProgress.query.filter_by(known=True).count()
        unknown_words_count = UserProgress.query.filter_by(known=False).count()
        
        return jsonify({
            'overview': {
                'total_words': total_words,
                'total_users': total_users,
                'total_progress_records': total_progress_records,
                'recent_words_added': recent_words,
                'known_words_count': known_words_count,
                'unknown_words_count': unknown_words_count
            },
            'words_by_category': [
                {'category': cat, 'count': count} 
                for cat, count in words_by_category
            ],
            'words_by_difficulty': [
                {'difficulty': diff, 'count': count} 
                for diff, count in words_by_difficulty
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/words', methods=['GET'])
@jwt_required()
def get_word_analytics():
    """Get detailed word analytics"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get most attempted words
        most_attempted = db.session.query(
            Word.word,
            Word.id,
            func.sum(UserProgress.attempts).label('total_attempts'),
            func.count(UserProgress.id).label('user_count')
        ).join(UserProgress).group_by(Word.id).order_by(
            func.sum(UserProgress.attempts).desc()
        ).limit(10).all()
        
        # Get words with highest success rate
        success_rate = db.session.query(
            Word.word,
            Word.id,
            func.count(UserProgress.id).label('total_attempts'),
            func.sum(func.cast(UserProgress.known, db.Integer)).label('known_count')
        ).join(UserProgress).group_by(Word.id).having(
            func.count(UserProgress.id) > 0
        ).all()
        
        # Calculate success rates
        success_rate_data = []
        for word, word_id, total, known in success_rate:
            rate = (known / total * 100) if total > 0 else 0
            success_rate_data.append({
                'word': word,
                'id': word_id,
                'success_rate': round(rate, 2),
                'total_attempts': total,
                'known_count': known
            })
        
        # Sort by success rate
        success_rate_data.sort(key=lambda x: x['success_rate'], reverse=True)
        
        return jsonify({
            'most_attempted_words': [
                {
                    'word': word,
                    'id': word_id,
                    'total_attempts': total_attempts,
                    'user_count': user_count
                }
                for word, word_id, total_attempts, user_count in most_attempted
            ],
            'highest_success_rate': success_rate_data[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/users', methods=['GET'])
@jwt_required()
def get_user_analytics():
    """Get user analytics"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get user progress statistics
        user_stats = db.session.query(
            User.username,
            User.id,
            func.count(UserProgress.id).label('total_words_attempted'),
            func.sum(func.cast(UserProgress.known, db.Integer)).label('words_known'),
            func.sum(UserProgress.attempts).label('total_attempts')
        ).outerjoin(UserProgress).group_by(User.id).all()
        
        # Get recent user activity
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_users = User.query.filter(User.created_at >= thirty_days_ago).count()
        
        # Process user stats
        user_analytics = []
        for username, user_id, attempted, known, attempts in user_stats:
            success_rate = (known / attempted * 100) if attempted > 0 else 0
            user_analytics.append({
                'username': username,
                'id': user_id,
                'words_attempted': attempted or 0,
                'words_known': known or 0,
                'total_attempts': attempts or 0,
                'success_rate': round(success_rate, 2)
            })
        
        # Sort by success rate
        user_analytics.sort(key=lambda x: x['success_rate'], reverse=True)
        
        return jsonify({
            'user_statistics': user_analytics,
            'recent_users_count': recent_users,
            'total_users': len(user_analytics)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/analytics/activity', methods=['GET'])
@jwt_required()
def get_activity_analytics():
    """Get activity analytics over time"""
    try:
        # Verify admin
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        if not admin:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get words created over last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        daily_words = db.session.query(
            func.date(Word.created_at).label('date'),
            func.count(Word.id).label('count')
        ).filter(Word.created_at >= thirty_days_ago).group_by(
            func.date(Word.created_at)
        ).order_by(func.date(Word.created_at)).all()
        
        # Get user registrations over last 30 days
        daily_users = db.session.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('count')
        ).filter(User.created_at >= thirty_days_ago).group_by(
            func.date(User.created_at)
        ).order_by(func.date(User.created_at)).all()
        
        return jsonify({
            'daily_words_created': [
                {
                    'date': str(date),
                    'count': count
                }
                for date, count in daily_words
            ],
            'daily_user_registrations': [
                {
                    'date': str(date),
                    'count': count
                }
                for date, count in daily_users
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

