import hmac
import hashlib
import imp
from turtle import update
import requests
import utils
import time
from datetime import datetime
from decimal import Decimal
from requests.auth import AuthBase
from dataclasses import dataclass


logger = utils.init_log()

@dataclass
class CoinbaseTransaction:
    id: str
    updated_at : datetime
    native_amount_amount : Decimal
    native_amount_currency : str
    type : str
    crypto_amount_amount : Decimal
    crypto_amount_currency : str

class CoinbaseWalletAuth(AuthBase):
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def __call__(self, request):
        timestamp = str(int(time.time()))
        message = timestamp + request.method + request.path_url + (request.body or "")
        signature = hmac.new(bytes(self.secret_key, "UTF-8"), bytes(message,"UTF-8"), hashlib.sha256).hexdigest()

        request.headers.update({
            "CB-ACCESS-SIGN": signature,
            "CB-ACCESS-TIMESTAMP": timestamp,
            "CB-ACCESS-KEY": self.api_key,
            "CB-VERSION" : '2021-11-24'
        })

        return request

def load_all_transactions(user):
    result = []
    api_url = "https://api.coinbase.com/v2/"
    auth = CoinbaseWalletAuth(user.coinbase_api_key, user.coinbase_api_secret)

    r = requests.get(api_url + "accounts", auth=auth)
    json_response = r.json()
    for account in json_response.get("data"):
        id = account.get('id')
        
        if id and len(id) > 12:
            r = requests.get(api_url + f"accounts/{id}/transactions", auth=auth)
            json_response = r.json()
            data = json_response.get("data")
            if len(data) > 0:
                for trx in data:
                    if trx["status"] == 'completed':
                        id = trx["id"]
                        updated_at = trx["updated_at"]
                        native_amount_amount = trx["native_amount"]["amount"]
                        native_amount_currency = trx["native_amount"]["currency"]
                        type = trx["type"]
                        crypto_amount_amount = trx["amount"]["amount"]
                        crypto_amount_currency = trx["amount"]["currency"]
                        result.append(CoinbaseTransaction(
                            id, 
                            updated_at, 
                            native_amount_amount, 
                            native_amount_currency,
                            type,
                            crypto_amount_amount,
                            crypto_amount_currency
                        ))

    
    return result