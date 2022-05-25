import requests
import utils

logger = utils.init_log()

def list_lights(api_token):
    headers = {
        "Authorization": "Bearer %s" % api_token,
    }
    logger.debug(api_token)
    response = requests.get('https://api.lifx.com/v1/lights/all', headers=headers)
    logger.debug(response.json())