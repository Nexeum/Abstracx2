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

@app.route('/runs', methods=['GET'])
@cross_origin()
def get_runs():
    try:
        status = request.args.get('status')
        with db.cursor() as cur:
            query = """
                SELECT r.rid, t.teamname, p.name, r.language, r.time, r.result, r.access
                FROM runs r
                INNER JOIN teams t ON r.tid = t.tid
                INNER JOIN problems p ON r.pid = p.pid
                WHERE r.access != 'deleted' AND (t.status = 'Normal' OR t.status = 'Admin')
                AND (p.status = 'Active' OR (%s = 'Admin' AND p.status != 'Delete'))
                ORDER BY r.rid DESC
            """
            cur.execute(query, (status,))
            column_names = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            runs = [dict(zip(column_names, row)) for row in rows]
            return jsonify({'runs': runs})
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch runs', 'message': str(e)}), 500

@app.route('/groups', methods=['GET'])
@cross_origin()
def get_groups():
    try:
        with db.cursor() as cur:
            query = "SELECT * FROM groups WHERE statusx < 2"
            cur.execute(query)
            column_names = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            groups = [dict(zip(column_names, row)) for row in rows]
            return jsonify({'groups': groups})
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch groups', 'message': str(e)}), 500

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

@app.route('/problems', methods=['GET'])
@cross_origin()
def get_problems():
    try:
        with db.cursor() as cur:
            cur.execute("SELECT pid, name, code, pgroup, type, score FROM problems WHERE status != 'Delete'")
            column_names = [desc[0] for desc in cur.description]
            problems = [dict(zip(column_names, row)) for row in cur.fetchall()]
            return jsonify({'problems': problems})
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch problems', 'message': str(e)}), 500

@app.route('/problem/<int:problem_id>', methods=['GET'])
def get_problem_details(problem_id):
    try:
        with db.cursor() as cur:
            cur.execute("SELECT * FROM problems WHERE pid = %s", (problem_id,))
            row = cur.fetchone()

            if row is not None:
                column_names = [desc[0] for desc in cur.description]
                problem_details = dict(zip(column_names, row))
                return jsonify(problem_details)
            else:
                return jsonify({'error': 'Problem not found'}), 404

    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch problem details', 'message': str(e)}), 500
    
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
    
@app.route('/team-details', methods=['GET'])
@cross_origin()
def get_team_details():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token not provided', 'message': 'A token is required'}), 401
        
        if token.startswith('Bearer '):
            token = token.split(' ')[1]

        payload = verify_token(token)
        user_id = payload.get('user_id')
    
        with db.cursor() as cur:
            query = "SELECT * FROM Teams where tid = %s"
            cur.execute(query, (user_id,))
            column_names = [desc[0] for desc in cur.description]
            team_details = [dict(zip(column_names, row)) for row in cur.fetchall()]
            return jsonify({'team_details': team_details})
    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch team details', 'message': str(e)}), 500

@app.route('/status', methods=['GET'])
@cross_origin()
def get_status():
    if db.open:
        status = "UP"
    else:
        status = "DOWN"

    status_data = {
        "status": status,
        "version": "abstracx-trunk.20231020.1"
    }

    return jsonify(status_data)

@app.route('/admin', methods=['GET'])
@cross_origin()
def get_admin_data():
    try:
        with db.cursor() as cur:
            cur.execute("SELECT value FROM admin WHERE variable = 'notice'")
            row = cur.fetchone()

            if row is not None:
                notice = row[0]
                return jsonify({'notice': notice})
            else:
                return jsonify({'error': 'Data not found'}), 404

    except pymysql.Error as sql_error:
        return jsonify({'error': 'Database error', 'message': str(sql_error)}), 500
    except Exception as e:
        return jsonify({'error': 'Failed to fetch admin details', 'message': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)