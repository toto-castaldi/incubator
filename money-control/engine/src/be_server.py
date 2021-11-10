import functools
import firebase_admin
import utils
import os
import traceback
import db
from firebase_admin import credentials
from firebase_admin import auth
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename


db.connection_param = {
    "dbname" : "moneymap", 
    "user" : "moneymap", 
    "password" : "moneymap", 
    "host" : os.environ.get("DB_HOST", "localhost"),
    "port" : 5432
}

logger = utils.init_log()

cred = credentials.Certificate(os.path.abspath(os.environ.get("FIREBASE_ACCOUNT_KEY_PATH")))
firebase_admin.initialize_app(cred)

app = Flask(__name__)

def authenticated(f):
    @functools.wraps(f)  
    def wrapper(*args, **kwargs):
        query, header, body = args

        token = header.get('Authorization')
        if not token:
            return (400, { 'message': 'Missing required header parameter' })

        try:
            decoded_token = auth.verify_id_token(token)
        except:
            return (400, { 'message': 'Invalid token' })
       
        query['uid'] = decoded_token.get('uid')
        value = f(*args, **kwargs)
        return value
    return wrapper

def handler(method, path, request_query, request_headers, request_body):
    logger.debug(f"method: {method}")
    logger.debug(f"path: {path}")
    logger.debug(f"body: {request_body}")
    logger.debug(f"headers: {request_headers}")
    logger.debug(f"query: {request_query}")

    if method == "OPTIONS":
        return (200, {})

    if path in routes and method in routes[path]:
        return routes[path][method](request_query, request_headers, request_body)

    return (501, {})

@authenticated
def card_usage_create(query, header, body):
    logger.debug(body)

    amount = body.get('amount')
    description = body.get('description')
    user = query.get('uid')
    tag = body.get('tag')

    db.insert_card_usage(amount, description, user, tag)

    return (201, { 'message': 'card usage created' })

@authenticated
def search_tag(query, header, body):
    logger.debug(query.get('like'))

    tags = db.search_tags(query.get('uid'), query.get('like'))

    logger.debug(tags)

    return (200, { 'tags' : tags })

@authenticated
def search_description(query, header, body):

    descriptions = db.search_description(query.get('uid'), query.get('like'))

    return (200, { 'descriptions' : descriptions })

def echo(query, header, body):
    return (200, { 'ok': 'ok' })

def upload(query, header, body):
    file = query.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(os.environ.get('UPLOAD_FOLDER', '.'), filename))
    return (200, { 'ok': 'ok' })

routes = {
    "/card-usage" : {"POST" : card_usage_create},
    "/tag" : {"GET" : search_tag},
    "/description" : {"GET" : search_description},
    "/echo" : {"GET" : echo},
    "/upload" : { "POST", upload}
}

@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET', 'DELETE'])
def main_entry_point(path):
    method = request.method
    request_query = request.args.copy()
    request_headers = request.headers
    request_body = request.json if request.json else {}

    try:

        (handled_code, handled_body) = handler(method, f"/{path}", request_query, request_headers, request_body)

        resp = make_response(handled_body, handled_code)

        return resp
        
    except Exception as e:
        traceback.print_exc()
        return make_response({"error": "Internal server error", "message": f"{e}"}, 500)




if __name__ == '__main__':
    app.run(port=5000, debug=True, host="0.0.0.0")