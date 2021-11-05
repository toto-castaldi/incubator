import psycopg2
from psycopg2.extras import RealDictCursor
import utils

logger = utils.init_log()

conn = None
connection_param = None

INSERT_CARD_USAGE = """
                    INSERT INTO "card-usage"
                    ("user", "description", "amount", "tag")
                    VALUES(
                      %(user)s, %(description)s, %(amount)s, %(tag)s
                    );"""

SEARCH_TAG = """
              select distinct tag 
              from "card-usage" 
              where "user" = %(user)s and upper(tag) like %(like)s
              ;"""

SEARCH_DESCRIPTION = """
                      select distinct description
                      from "card-usage" 
                      where "user" = %(user)s and upper(description) like %(like)s
                      ;"""



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


def fetch(query, args={}, all=False, format=None):
  with get_conn() as conn:   
    with conn.cursor() as cursor:
      if format:
        query = query.format(*format)
      cursor.execute(query, args)
      result = cursor.fetchall() if all else cursor.fetchone()
      return result


def execute(query, args={}, format=None):
  with get_conn() as conn:   
    with conn.cursor() as cursor:
      if format:
        query = query.format(*format)
      cursor.execute(query, args)

def like_term(term):
  term= term.replace('=', '==').replace('%', '=%').replace('_', '=_')
  like = ('%'+term+'%').upper()
  return like

def insert_card_usage(amount, description, user, tag):
    execute(INSERT_CARD_USAGE, args={
        "user" : user,
        "description" : description,
        "amount" : amount,
        "tag" : tag
    })

def search_tags(user, term):
    return list(map(lambda el : el["tag"], fetch(SEARCH_TAG, args={
        "user" : user,
        "like" : like_term(term)
    }, all=True)))

def search_description(user, term):
    return list(map(lambda el : el["description"], fetch(SEARCH_DESCRIPTION, args={
        "user" : user,
        "like" : like_term(term)
    }, all=True)))