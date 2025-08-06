from src.database import db
from datetime import datetime

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.Text)
    category = db.Column(db.String(50), default='general')
    difficulty = db.Column(db.String(20), default='beginner')
    language = db.Column(db.String(20), default='english')
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Word {self.word}>'

    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'image_url': self.image_url,
            'category': self.category,
            'difficulty': self.difficulty,
            'language': self.language,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'), nullable=False)
    known = db.Column(db.Boolean, default=False)
    attempts = db.Column(db.Integer, default=0)
    last_attempt = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<UserProgress user:{self.user_id} word:{self.word_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word_id': self.word_id,
            'known': self.known,
            'attempts': self.attempts,
            'last_attempt': self.last_attempt.isoformat() if self.last_attempt else None
        }

