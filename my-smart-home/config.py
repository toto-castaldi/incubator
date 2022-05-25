import json
import os
import utils

the_config = None

def get_config():
  global the_config
  if not the_config:
    with open(os.getenv("CONFIG"), "r") as f:
        json_file = f.read()
        the_config = json.loads(json_file)

  return the_config