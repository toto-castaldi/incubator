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

def search_button(bd_addr:str):
  for button in the_config["buttons"]:
    if button["bd_addr"] == bd_addr:
      return button
  return None

def search_action(button, c_type):
  for action in button["actions"]:
    if action["type"] == c_type:
      return action
  return None
