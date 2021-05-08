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

logger_handler = False

def init_log():
  
  global logger_handler

  logger = logging.getLogger()
  logger.setLevel(log_level)

  
  if logger_handler is False:
    ch = logging.StreamHandler()
    ch.setLevel(log_level)

    formatter = logging.Formatter('[%(levelname)s] %(message)s')
    ch.setFormatter(formatter)

    logger.addHandler(ch)

    logger_handler = True
    
  return logger