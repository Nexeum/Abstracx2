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
    
if __name__ == "__main__":
    app.run(port=5002, debug=True)