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
)

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired', 'message': 'Log in again'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token', 'message': 'Log in again'}), 401

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
    
if __name__ == "__main__":
    app.run(port=5001, debug=True)