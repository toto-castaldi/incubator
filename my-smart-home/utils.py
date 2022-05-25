import logging
import logging.handlers
import os
from datetime import timedelta
from datetime import date
from datetime import datetime
from decimal import Decimal

LOG_LEVELS = {
  'INFO' : 20,
  'DEBUG' : 10,
  'WARNING' : 30,
  'ERROR' : 40,
  'CRITICAL' : 50
}

log_level =  LOG_LEVELS.get(os.environ.get("LOG_LEVEL","INFO"))
logger_filename = os.environ.get("LOG_FILE_NAME", None)
logger = None

def init_log():
  global logger

  if not logger:
    streamHandler = logging.StreamHandler()
    streamHandler.setLevel(log_level)
    formatter = logging.Formatter('[%(levelname)s] - %(asctime)s : %(message)s', datefmt='%Y/%m/%d %H:%M:%S')
    streamHandler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.addHandler(streamHandler)

    if logger_filename is not None:
      f_handler = logging.handlers.TimedRotatingFileHandler(f'./log/{logger_filename}.log', when='midnight', backupCount=10)
      f_handler.setFormatter(formatter)
      f_handler.setLevel(log_level)
      
      logger.addHandler(f_handler)

    logger.setLevel(log_level)
    
  return logger