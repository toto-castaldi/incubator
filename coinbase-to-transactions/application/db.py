import psycopg2
import utils
from psycopg2.extras import RealDictCursor
from dataclasses import dataclass, asdict

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

INSERT_COINBASE_TRANSACTION = '''
INSERT INTO coinbase_trx (account_id, trx_id, updated_at, native_amount_amount, crypto_amount_amount, buy_sell, native_amount_currency, crypto_amount_currency)
VALUES (%(account_id)s, %(id)s, %(updated_at)s, %(native_amount_amount)s, %(crypto_amount_amount)s, %(type)s, %(native_amount_currency)s, %(crypto_amount_currency)s)
on conflict (trx_id) do nothing;
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
    logger.debug(user)
    for transaction in transactions:  
      with get_conn() as conn:  
        with conn.cursor() as cursor:
          arg = asdict(transaction)
          arg["account_id"] = user.id
          logger.debug(arg)
          cursor.execute(INSERT_COINBASE_TRANSACTION, arg)
      
