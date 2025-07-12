
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import secrets
import string
from datetime import timedelta
import os
from dotenv import load_dotenv
from ai_timetable import TimetableGenerator
import logging

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', secrets.token_urlsafe(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

jwt = JWTManager(app)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database initialization with enhanced schema
def init_enhanced_db():
    conn = sqlite3.connect('timetable_enhanced.db')
    cursor = conn.cursor()
    
    # Users table with additional fields
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            employee_id TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('main_admin', 'dept_admin', 'staff')),
            department_id INTEGER,
            programme TEXT,
            type TEXT,
            contact_number TEXT,
            staff_role TEXT CHECK (staff_role IN ('assistant_professor', 'professor', 'hod')),
            subjects_selected TEXT,
            subjects_locked BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    ''')
    
    # ... keep existing code (departments, subjects, classrooms, timetables tables)
    
    # API Keys table for admin configuration
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_name TEXT NOT NULL UNIQUE,
            api_key TEXT NOT NULL,
            updated_by INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (updated_by) REFERENCES users (id)
        )
    ''')
    
    # Department constraints table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS department_constraints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department_id INTEGER NOT NULL,
            constraint_type TEXT NOT NULL,
            constraint_value TEXT NOT NULL,
            created_by INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments (id),
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Insert default main admin if not exists
    cursor.execute('SELECT id FROM users WHERE email = ?', ('srmtt@srmist.edu.in',))
    if not cursor.fetchone():
        password_hash = generate_password_hash('mcs2024')
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, username, employee_id, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('Main Administrator', 'srmtt@srmist.edu.in', password_hash, 'mainadmin', 'ADMIN001', 'main_admin'))
    
    conn.commit()
    conn.close()

def generate_credentials():
    """Generate unique username and password"""
    username = 'user_' + ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(8))
    return username, password

# Authentication routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        conn = sqlite3.connect('timetable_enhanced.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.id, u.name, u.email, u.password_hash, u.role, u.department_id, 
                   u.staff_role, u.subjects_selected, u.subjects_locked, u.username,
                   u.employee_id, d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE u.email = ? AND u.is_active = 1
        ''', (email,))
        
        user_data = cursor.fetchone()
        conn.close()
        
        if not user_data or not check_password_hash(user_data[3], password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user = {
            'id': str(user_data[0]),
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[4],
            'department_id': str(user_data[5]) if user_data[5] else None,
            'staff_role': user_data[6],
            'subjects_selected': user_data[7].split(',') if user_data[7] else [],
            'subjects_locked': bool(user_data[8]),
            'username': user_data[9],
            'employee_id': user_data[10],
            'department_name': user_data[11]
        }
        
        access_token = create_access_token(identity=str(user_data[0]))
        
        logger.info(f"User {email} logged in successfully with role {user['role']}")
        
        return jsonify({
            'success': True,
            'data': {
                'user': user,
                'token': access_token
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user_id = get_jwt_identity()
        conn = sqlite3.connect('timetable_enhanced.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.id, u.name, u.email, u.role, u.department_id, 
                   u.staff_role, u.subjects_selected, u.subjects_locked, u.username,
                   u.employee_id, d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE u.id = ? AND u.is_active = 1
        ''', (current_user_id,))
        
        user_data = cursor.fetchone()
        conn.close()
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        user = {
            'id': str(user_data[0]),
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'department_id': str(user_data[4]) if user_data[4] else None,
            'staff_role': user_data[5],
            'subjects_selected': user_data[6].split(',') if user_data[6] else [],
            'subjects_locked': bool(user_data[7]),
            'username': user_data[8],
            'employee_id': user_data[9],
            'department_name': user_data[10]
        }
        
        return jsonify({'success': True, 'user': user}), 200
        
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return jsonify({'error': 'Token verification failed'}), 401

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

# Main Admin routes
@app.route('/api/admin/register-user', methods=['POST'])
@jwt_required()
def register_user():
    try:
        current_user_id = get_jwt_identity()
        
        # Verify main admin
        conn = sqlite3.connect('timetable_enhanced.db')
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'main_admin':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        required_fields = ['name', 'employee_id', 'department', 'programme', 'type', 'role', 'contact_number', 'email']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate credentials
        username, password = generate_credentials()
        password_hash = generate_password_hash(password)
        
        # Get or create department
        cursor.execute('SELECT id FROM departments WHERE name = ?', (data['department'],))
        dept_result = cursor.fetchone()
        
        if not dept_result:
            # Create department
            dept_code = data['department'][:3].upper() + str(secrets.randbelow(1000)).zfill(3)
            cursor.execute('INSERT INTO departments (name, code) VALUES (?, ?)', 
                         (data['department'], dept_code))
            department_id = cursor.lastrowid
        else:
            department_id = dept_result[0]
        
        # Create user
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, username, employee_id, role, 
                             department_id, programme, type, contact_number, staff_role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['email'], password_hash, username, data['employee_id'],
            data['role'], department_id, data['programme'], data['type'], 
            data['contact_number'], data.get('staff_role')
        ))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Return user data with credentials
        user_data = {
            'id': str(user_id),
            'name': data['name'],
            'email': data['email'],
            'employee_id': data['employee_id'],
            'role': data['role'],
            'department_id': str(department_id),
            'username': username,
            'password': password,  # Only returned during registration
            'department_name': data['department']
        }
        
        logger.info(f"User {data['email']} registered successfully by admin {current_user_id}")
        
        return jsonify({
            'success': True,
            'data': user_data,
            'message': f'User registered successfully. Username: {username}, Password: {password}'
        }), 201
        
    except Exception as e:
        logger.error(f"User registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

# ... keep existing code (other API routes would continue here)

if __name__ == '__main__':
    init_enhanced_db()
    app.run(debug=True, port=5000, host='0.0.0.0')
