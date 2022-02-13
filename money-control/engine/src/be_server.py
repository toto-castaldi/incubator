import functools
import firebase_admin
import utils
import os
import traceback
import db
import tempfile
import importer
import datetime
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import auth
from flask import Flask, request, make_response


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

CORS(app)

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
    discount = body.get('discount')

    id = db.insert_card_usage(amount, description, user, tag)

    logger.debug(f"id : {id}")

    if discount is not None:
        db.apply_discount_card_usage_id(id, discount)

    return (201, { 'message': f'card usage created {id} with discount {discount}' })

@authenticated
def card_usage_discount(query, header, body):

    card_usage = db.search_card_usage_id_user(body.get('id'), query.get('uid'))

    if card_usage:
        discount_rate = body.get('discount')
        db.apply_discount_card_usage_id(body.get('id'), discount_rate)
        return (200, { 'result' : f'card_uage {card_usage} with discount {discount_rate}' })
    else:
        return (404, { 'result' : 'movement not found' })

@authenticated
def card_usage_update(query, header, body):

    card_usage = db.search_card_usage_id_user(body.get('id'), query.get('uid'))

    if card_usage:
        tag = body.get('tag')
        if tag:
            db.apply_tag_card_usage_id(body.get('id'), tag)
            return (200, { 'result' : f'card_uage {card_usage} with tag {tag}' })
        discount_rate = body.get('discount')
        if discount_rate:
            db.apply_discount_card_usage_id(body.get('id'), discount_rate)
            return (200, { 'result' : f'card_uage {card_usage} with discount {discount_rate}' })
        return (501, { 'result' : f'card_uage {card_usage} no update' })
    else:
        return (404, { 'result' : 'movement not found' })

routes = {
    "/card-usage" : {
                        "POST" : card_usage_create,
                        "PUT" : card_usage_update
                    }
}

@app.route('/map', methods = ['POST'])
def map_movement_usage():
    token_present, token_value = extract_token(request.headers)

    if token_present and token_value is not None:

        card_usage_id = request.json.get('card-usage-id')
        cc_movement_id = request.json.get('cc-movement-id')

        db.map_movement_usage(card_usage_id, cc_movement_id)

        return { 'message': 'mapping created' }, 201
    else:
        return {}, 401

@app.route('/cc-movement', methods = ['DELETE'])
def delete_cc_movement():
    token_present, token_value = extract_token(request.headers)

    if token_present and token_value is not None:

        cc_movement = db.search_cc_movement_id_user(request.args.get('id'), token_value)

        if cc_movement:
            db.delete_cc_movement_id(request.args.get('id'))
            return { 'result' : f'cc_movement {cc_movement}  deleted' }, 200
        else:
            return { 'result' : 'movement not found' }, 404
    else:
        return {}, 401

@app.route('/description', methods = ['GET'])
def search_description():
    token_present, token_value = extract_token(request.headers)

    if token_present and token_value is not None:
        result = db.search_description(token_value, request.args.get('like'))

        return { 'result' : result }, 200
    else:
        return {}, 401

@app.route('/unmapped-cc-movement', methods = ['GET'])
def unmapped_cc_movement():
    token_present, token_value = extract_token(request.headers)

    if token_present and token_value is not None:
        result = db.unmapped_cc_movement(token_value)

        result = list(map(lambda el : { "description" : el["description"], "amount" : '{0:.3g}'.format(el["amount"]), "bank" : el["bank"], "date" : el["date"] }, result))

        logger.debug(result)



        return { 'result' : result }, 200
    else:
        return {}, 401
    

@app.route('/map', methods = ['DELETE'])
def delete_map():
    token_present, token_value = extract_token(request.headers)

    if token_present and token_value is not None:
        usage_id = request.args.get('usage')
        db.delete_map(usage_id)

        return { 'result' : f"{usage_id} CARD USAGE mapping deleted"}, 200
    else:
        return {}, 401

@app.route('/daily_rate', methods = ['GET'])
def daily_rate():
    token_present, token_value = extract_token(request.headers)

    logger.debug(f'{token_present}, {token_value}')

    if token_present and token_value is not None:
        query_from = request.args.get('from')
        query_to = request.args.get('to')
        delta_days = request.args.get('past_days')

        logger.debug(f"dd {delta_days}")

        if delta_days is None:
            amount = db.whold_sum_amount(token_value, query_from, query_to, delta_days)['sum']
            delta_days = db.whole_delta_days(token_value, query_from, query_to)['delta']
        else:
            amount = db.whold_sum_amount(token_value, query_from, query_to, str(delta_days) + ' DAYS')['sum']
            delta_days = int(delta_days)
            
        logger.debug(f"{amount} {delta_days}")
        return { 'result' : str(amount / delta_days)}, 200
    else:
        return {}, 401
        


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

@app.route('/budget', methods = ['GET'])
def budget():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        total = request.args.get('total')
        days = request.args.get('days')

        budget = db.budget_days(token_value, total, str(days) + ' DAYS')['budget']

        return { 'result' : f'budget {budget}'}, 200
    else:
        return {}, 401

@app.route('/expenditure-group', methods = ['GET'])
def expenditure_group():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        days = request.args.get('days')

        expenditure = db.expenditure_group(token_value, str(days) + ' DAYS')

        logger.debug(expenditure)

        res = []

        for e in expenditure:
            logger.debug(e)
            res.append({'total' : '{0:.3g}'.format(e.get('total')), 'tag' : e.get('tag')})

        return { 'result' : res}, 200
    else:
        return {}, 401

@app.route('/expenditure', methods = ['GET'])
def expenditure():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        days = request.args.get('days')

        expenditure = db.expenditure(token_value, str(days) + ' DAYS')

        logger.debug(expenditure)

        res = []

        for e in expenditure:
            logger.debug(e)
            res.append({'amount' : '{0:.3g}'.format(e.get('amount')), 'date' : e.get('date'), 'full_desc' : e.get('full_desc'), 'description' : e.get('description')})

        return { 'result' : res}, 200
    else:
        return {}, 401

@app.route('/tag', methods = ['GET'])
def search_tag():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        tags = db.search_tags(token_value, request.args.get('like'))

        logger.debug(tags)

        return { 'tags' : tags }, 200
    else:
        return {}, 401

@app.route('/budget-extra', methods = ['GET'])
def budget_extra():
    token_present, token_value = extract_token(request.headers)
    if token_present and token_value is not None:

        interval = int(request.args.get('interval'))
        extras = request.args.getlist('extras')
        total_budget = int(request.args.get('total_budget'))
        date_from = request.args.get('from')
        if date_from is None:
            date_from =  str(datetime.datetime.now().year) + "-" + str(datetime.datetime.now().month) + "-1"


        logger.debug(f"interval {interval}")
        logger.debug(f"extras {extras}")
        logger.debug(f"total_budget {total_budget}")
        logger.debug(f"date_from {date_from}")

        delta_days = db.whole_delta_days(token_value, None, None)['delta']

        logger.debug(f"delta_days {delta_days}")

        total_by_tag = db.total_by_tag(token_value)

        logger.debug(f"delta_days {total_by_tag}")

        mean_interval_by_tag = list(map(lambda el : { "total" : el["total"] * interval / delta_days, "tag" : el["tag"]}, total_by_tag))

        logger.debug(f"mean_interval_by_tag {mean_interval_by_tag}")

        mean_interval_by_not_extra_tag = list(filter(lambda x: x["tag"] not in extras, mean_interval_by_tag))

        logger.debug(f"mean_interval_by_not_extra_tag {mean_interval_by_not_extra_tag}")

        budget_extra = total_budget - functools.reduce(lambda t,item: t+item["total"], mean_interval_by_not_extra_tag, 0)

        logger.debug(f"budget_not_extra {budget_extra}")

        extras_from = db.total_from_in_tags(token_value, date_from, extras )

        for e in extras_from:
            logger.debug(e)

        total_extras_from = functools.reduce(lambda t,item: t+item["amount"], extras_from, 0)

        logger.debug(f"total_extras_from {total_extras_from}")

        return { "extra_budget" : '{0:.3g}'.format(budget_extra), "extra_spent" : '{0:.3g}'.format(total_extras_from)}, 200
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