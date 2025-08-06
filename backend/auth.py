from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from src.models.admin import Admin
from src.database import db
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        username = data['username']
        password = data['password']
        
        # Find admin by username
        admin = Admin.query.filter_by(username=username).first()
        
        if not admin or not admin.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        admin.update_last_login()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(
            identity=admin.id,
            expires_delta=timedelta(hours=24)
        )
        refresh_token = create_refresh_token(
            identity=admin.id,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'admin': admin.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404
        
        new_token = create_access_token(
            identity=admin.id,
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({'access_token': new_token}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify token and get current admin info"""
    try:
        current_admin_id = get_jwt_identity()
        admin = Admin.query.get(current_admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404
        
        return jsonify({'admin': admin.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout endpoint (client should discard token)"""
    return jsonify({'message': 'Successfully logged out'}), 200

@auth_bp.route('/auth/create-admin', methods=['POST'])
def create_admin():
    """Create initial admin account (for setup only)"""
    try:
        # Check if any admin exists
        if Admin.query.first():
            return jsonify({'error': 'Admin already exists'}), 400
        
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password') or not data.get('email'):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Create new admin
        admin = Admin(
            username=data['username'],
            email=data['email']
        )
        admin.set_password(data['password'])
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Admin created successfully',
            'admin': admin.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

