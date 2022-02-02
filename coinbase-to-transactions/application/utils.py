import logging
import os

LOG_LEVELS = {
  'INFO' : 20,
  'DEBUG' : 10,
  'WARNING' : 30,
  'ERROR' : 40,
  'CRITICAL' : 50
}

log_level =  LOG_LEVELS.get(os.environ.get('LOG_LEVEL','INFO'))
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
    logger.setLevel(log_level)
    
  return logger
