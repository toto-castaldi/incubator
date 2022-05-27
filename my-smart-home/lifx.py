import string
import requests
import utils

logger = utils.init_log()

def list_lights(api_token:string):
    headers = {
        "Authorization": "Bearer %s" % api_token,
    }
    logger.debug(api_token)
    response = requests.get("https://api.lifx.com/v1/lights/all", headers=headers)
    logger.debug(response.json())

def toggle(device_id:string, api_token:string):
    headers = {
        "Authorization": "Bearer %s" % api_token,
    }
    logger.debug(api_token)
    response = requests.post(f"https://api.lifx.com/v1/lights/{device_id}/toggle", headers=headers)
    logger.debug(response.json())

def state_delta(device_id:string, api_token:string, brightness = None):
    headers = {
        "Authorization": "Bearer %s" % api_token,
    }
    payload = {

    }
    if brightness is not None:
        payload["brightness"] = brightness
    response = requests.post(f"https://api.lifx.com/v1/lights/{device_id}/state/delta", data=payload, headers=headers)
    logger.debug(response.json())