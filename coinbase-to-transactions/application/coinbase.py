import hmac
import hashlib
import imp
import requests
import utils
from requests.auth import AuthBase


logger = utils.init_log()

class CoinbaseWalletAuth(AuthBase):
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key

    def __call__(self, request):
        timestamp = str(int(time.time()))
        message = timestamp + request.method + request.path_url + (request.body or '')
        signature = hmac.new(bytes(self.secret_key, 'UTF-8'), bytes(message,'UTF-8'), hashlib.sha256).hexdigest()

        request.headers.update({
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-ACCESS-KEY': self.api_key,
            'CB-VERSION' : '2021-11-24'
        })

        return request

def load_all_transactions(user):
    api_url = 'https://api.coinbase.com/v2/'
    auth = CoinbaseWalletAuth(user.coinbase_api_key, user.coinbase_api_secret)

    r = requests.get(api_url + 'accounts', auth=auth)
    json_response = r.json()
    for account in json_response.get('data'):
        id = account.get('id')
        #print(id)
        if id and len(id) > 12:
            r = requests.get(api_url + f'accounts/{id}/transactions', auth=auth)
            json_response = r.json()
            data = json_response.get('data')
            if len(data) > 0:
                for trx in data:
                    logger.debug(trx)