import psycopg2
import utils
from psycopg2.extras import RealDictCursor
from dataclasses import dataclass

connection_param = {
        "dbname" : "dbpsql", 
        "user" : "dbpsql", 
        "password" : "dbpsql", 
        "host" : "localhost",
        "port" : 5432
    }

conn = None

logger = utils.init_log()

ALL_ACCOUNTS = '''
SELECT * FROM ACCOUNT
'''

@dataclass
class Account:
    id: str
    coinbase_api_key: str
    coinbase_api_secret: str

def get_conn():
  global conn

  if conn:
    try: 
      with conn.cursor() as cursor:
        cursor.execute("SELECT 1")
    except:
      conn = None

  if not conn and connection_param:
    conn = psycopg2.connect(dbname=connection_param["dbname"], user=connection_param["user"], password=connection_param["password"], host=connection_param["host"], port=connection_param["port"], cursor_factory=RealDictCursor)
       
  return conn


def fetch(query, args={}, all=False):
  with get_conn() as conn:   
    with conn.cursor() as cursor:
      cursor.execute(query, args)
      result = cursor.fetchall() if all else cursor.fetchone()
      return result

def load_all_accounts():
    return list(map(lambda e: Account(e["account_id"], e["coinbase_api_key"], e["coinbase_api_secret"]), fetch(ALL_ACCOUNTS, all=True)))
    

def merge_transactions(user, transactions):
    pass