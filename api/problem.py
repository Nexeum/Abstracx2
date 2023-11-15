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
    
if __name__ == "__main__":
    app.run(port=5003, debug=True)