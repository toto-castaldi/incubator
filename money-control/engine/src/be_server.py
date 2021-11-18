import functools
import firebase_admin
import utils
import os
import traceback
import db
import tempfile
import importer
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

temp_folder_name = os.environ.get("TEMP_FOLDER", "tmp")

os.makedirs(temp_folder_name, exist_ok=True)

app = Flask(__name__)

def extract_token(header):
    token = header.get('Authorization')
    if not token:
        return (False, None)

    try:
        decoded_token = auth.verify_id_token(token)
    except:
        return (True, None)

    return (True, decoded_token.get('uid'))
        

def authenticated(f):
    @functools.wraps(f)  
    def wrapper(*args, **kwargs):
        query, header, body = args

        present, token_value = extract_token(header)

        if present:
            if token_value:
                query['uid'] = token_value
                value = f(*args, **kwargs)
                return value
            else:
                return (400, { 'message': 'Invalid token' })
        else:
            return (400, { 'message': 'Missing required header parameter' })

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
def map_movement_usage(query, header, body):
    logger.debug(body)

    card_usage_id = body.get('card-usage-id')
    cc_movement_id = body.get('cc-movement-id')

    db.map_movement_usage(card_usage_id, cc_movement_id)

    return (201, { 'message': 'mapping created' })

@authenticated
def search_tag(query, header, body):
    logger.debug(query.get('like'))

    tags = db.search_tags(query.get('uid'), query.get('like'))

    logger.debug(tags)

    return (200, { 'tags' : tags })

@authenticated
def search_description(query, header, body):

    result = db.search_description(query.get('uid'), query.get('like'))

    return (200, { 'result' : result })

@authenticated
def delete_cc_movement(query, header, body):

    logger.debug(query.get('id'))

    cc_movement = db.search_cc_movement_id_user(query.get('id'), query.get('uid'))

    if cc_movement:
        db.delete_cc_movement_id(query.get('id'))
        return (200, { 'result' : f'cc_movement {cc_movement}  deleted' })
    else:
        return (404, { 'result' : 'movement not found' })

@authenticated
def cc_movement_discount(query, header, body):

    cc_movement = db.search_cc_movement_id_user(body.get('id'), query.get('uid'))

    if cc_movement:
        discount_rate = body.get('discount')
        db.apply_discount_cc_movement_id(body.get('id'), discount_rate)
        return (200, { 'result' : f'cc_movement {cc_movement} with discount {discount_rate}' })
    else:
        return (404, { 'result' : 'movement not found' })

    

def echo(query, header, body):
    return (200, { 'ok': 'ok' })

routes = {
    "/card-usage" : {"POST" : card_usage_create},
    "/map" : {"POST" : map_movement_usage},
    "/tag" : {"GET" : search_tag},
    "/description" : {"GET" : search_description},
    "/echo" : {"GET" : echo},
    "/cc-movement" : {"DELETE" : delete_cc_movement},
    "/cc-movement-discount" : {"PUT" : cc_movement_discount}
}

@app.route('/upload-fineco-cc-movements', methods = ['POST'])
def upload_cc_fineco():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        temp = tempfile.NamedTemporaryFile()
        temp_name = os.path.join(temp_folder_name, os.path.basename(temp.name) + "-cc-fineco.xlsx")
        #print(request.data)
        with open(temp_name, 'wb') as f:
            f.write(request.data)
            f.flush()
            f.close()
        logger.debug(f"{temp_name} written")

        try:
            importer.import_files(temp_folder_name, token_value)
        except Exception as e:
            traceback.print_exc()        

        os.remove(temp_name)

        return { 'result' : 'fineco cc movements loaded'}, 200
    else:
        return {}, 401

@app.route('/upload-fineco-card-movements', methods = ['POST'])
def upload_card_fineco():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        temp = tempfile.NamedTemporaryFile()
        temp_name = os.path.join(temp_folder_name, os.path.basename(temp.name) + "-card-fineco.xls")
        #print(request.data)
        with open(temp_name, 'wb') as f:
            f.write(request.data)
            f.flush()
            f.close()
        logger.debug(f"{temp_name} written")

        try:
            importer.import_files(temp_folder_name, token_value)
        except Exception as e:
            traceback.print_exc()        

        os.remove(temp_name)

        return { 'result' : 'fineco card movements loaded'}, 200
    else:
        return {}, 401

@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET', 'DELETE', 'PUT'])
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