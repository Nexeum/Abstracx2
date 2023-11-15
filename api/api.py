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

if __name__ == "__main__":
    app.run(port=5005, debug=True)