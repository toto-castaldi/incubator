import json

class Config():

    the_config = None

    @classmethod
    def get_instance(cls):
        if not cls.the_config:
            cls.the_config = Config()
        return cls.the_config

    def __init__(self):    
        with open('/config/coderbot.json') as json_file:
            self.data = json.load(json_file)
    