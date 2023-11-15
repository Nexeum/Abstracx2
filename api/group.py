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
    
if __name__ == "__main__":
    app.run(port=5004, debug=True)