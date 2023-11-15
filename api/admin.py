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
    app.run(port=5006, debug=True)