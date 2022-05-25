import json
import os
import utils

the_config = None

def get_config():
  global the_config
  if not the_config:
    if utils.is_dev_env():
        the_config = {
            "lifx_api_key" : os.getenv("LIFX_API_KEY")
        }
    else:
        with open("./common/config.json", "r") as f:
            json_file = f.read()
            the_config = json.loads(json_file)

  return the_config