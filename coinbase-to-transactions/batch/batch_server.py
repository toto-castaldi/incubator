import hmac
import hashlib
import time
import requests
import os
import schedule
import time
from requests.auth import AuthBase


# Before implementation, set environmental variables with the names API_KEY and API_SECRET
API_KEY = os.getenv('API_KEY')
API_SECRET = os.getenv('API_SECRET')

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

def load_coinbase():
    print("hello")
    time.sleep(12)
    return
    api_url = 'https://api.coinbase.com/v2/'
    auth = CoinbaseWalletAuth(API_KEY, API_SECRET)

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
                    print(trx)

schedule.every(10).seconds.do(load_coinbase)
#schedule.every(10).minutes.do(job)
#schedule.every().hour.do(job)
#schedule.every().day.at("10:30").do(job)
#schedule.every(5).to(10).minutes.do(job)
#schedule.every().monday.do(job)
#schedule.every().wednesday.at("13:15").do(job)
#schedule.every().minute.at(":17").do(job)

if __name__ == '__main__':
    while True:
        schedule.run_pending()
        time.sleep(1)