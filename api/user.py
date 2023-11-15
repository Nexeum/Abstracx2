from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS, cross_origin
import jwt
import datetime

app = Flask(__name__)
cors = CORS(app)

SECRET_KEY = "nexeum"

db = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='nexeum',
    autocommit=True
)

def generate_token(user_id):
    try:
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return token
    except Exception as e:
        return jsonify({'error': 'Token generation failed', 'message': str(e)}), 500

# Middleware de autenticación
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired', 'message': 'Log in again'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token', 'message': 'Log in again'}), 401

# Routes
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Invalid request', 'message': 'Email and password are required'}), 400

        with db.cursor() as cur:
            query = "SELECT * FROM Teams WHERE teamname = %s AND pass = %s"
            cur.execute(query, (email, password))

            user = cur.fetchone()
            if user:
                column_names = [desc[0] for desc in cur.description]
                user_dict = dict(zip(column_names, user))
                user_id = user_dict['tid']
                token = generate_token(user_id)
                return jsonify({'message': 'Login successful', 'token': token})
            else:
                return jsonify({'error': 'Invalid credentials', 'message': 'Invalid email or password'}), 401
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@app.route('/user', methods=['GET'])
@cross_origin()
def get_user_data():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token not provided', 'message': 'A token is required'}), 401

    if token.startswith('Bearer '):
        token = token.split(' ')[1]

    try:
        payload = verify_token(token)
        user_id = payload.get('user_id')
        with db.cursor() as cur:
            try:
                cur.execute("SELECT * FROM Teams WHERE tid = %s", (user_id,))
                user = cur.fetchone()

                if user:
                    column_names = [desc[0] for desc in cur.description]
                    user_dict = dict(zip(column_names, user))
                    cur.execute("SELECT COUNT(DISTINCT(runs.pid)) as n FROM runs, problems WHERE runs.tid = %s AND runs.result = 'AC' AND runs.pid = problems.pid AND problems.status = 'Active'", (user_id,))
                    column = [desc[0] for desc in cur.description]
                    data = cur.fetchone()
                    problem_dict = dict(zip(column, data))
                    return jsonify({
                        'teamname': user_dict['teamname'],
                        'status': user_dict['status'],
                        'score': user_dict['score'],
                        'solved': problem_dict['n'],
                    })
                else:
                    return jsonify({'error': 'User not found', 'message': 'User not found'}), 404
            except pymysql.Error as sql_error:
                return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired', 'message': 'Log in again'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token', 'message': 'Log in again'}), 401
    except Exception as e:
        return jsonify({'error': 'Failed to get user data', 'message': str(e)}), 500
    
@app.route('/change-password', methods=['POST'])
@cross_origin()
def change_password():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token not provided', 'message': 'A token is required'}), 401
        
        if token.startswith('Bearer '):
            token = token.split(' ')[1]

        payload = verify_token(token)
        user_id = payload.get('user_id')

        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not user_id or not old_password or not new_password:
            return jsonify({'error': 'Invalid request', 'message': 'User ID, old password, and new password are required'}), 400

        with db.cursor() as cur:
            query = "SELECT pass FROM Teams WHERE tid = %s"
            cur.execute(query, (user_id,))
            user = cur.fetchone()

            if user:
                stored_password = user[0]
                if old_password != stored_password:
                    return jsonify({'error': 'Invalid old password', 'message': 'The provided old password does not match the stored password'}), 400

                update_query = "UPDATE Teams SET pass = %s WHERE tid = %s"
                cur.execute(update_query, (new_password, user_id))

                return jsonify({'message': 'Password changed successfully'})
            else:
                return jsonify({'error': 'User not found', 'message': 'User not found'}), 404
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Password change failed', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)