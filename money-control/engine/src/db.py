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

INSERT_CC_MOVEMENT = """
                    INSERT INTO "cc-movement"
                    ("bank", "fingerprint", "date", "amount", "description", "user")
                    VALUES(
                      %(bank)s, %(fingerprint)s, %(date)s, %(amount)s, %(description)s, %(user)s
                    );"""

INSERT_MAPPING = """
                    INSERT INTO "usage-to-movement"
                    ("usage_id", "movement_id")
                    VALUES(
                      %(card_usage_id)s, %(cc_movement_id)s
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

SEARCH_CC_MOVEMENT = """
                      select * 
                      from "cc-movement"
                      where "user" = %(user)s and "bank" = %(bank)s and "fingerprint" = %(fingerprint)s 
                      ;"""

SEARCH_CC_MOVEMENT_ID_USER = """
                      select * 
                      from "cc-movement"
                      where "user" = %(user)s and "id" = %(id)s
                      ;"""

DELETE_CC_MOVEMENT = """
                      delete 
                      from "cc-movement"
                      where "id" = %(id)s
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

def map_movement_usage(card_usage_id, cc_movement_id):
  execute(INSERT_MAPPING, args={
      "card_usage_id" : card_usage_id,
      "cc_movement_id" : cc_movement_id
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

def search_cc_movement(bank, fingerprint, user):
  return fetch(SEARCH_CC_MOVEMENT, args={
      "user" : user,
      "bank" : bank,
      "fingerprint" : str(fingerprint)
  })

def search_cc_movement_id_user(id, user):
  return fetch(SEARCH_CC_MOVEMENT_ID_USER, args={
      "user" : user,
      "id" : id
  })


def delete_cc_movement_id(id):
  execute(DELETE_CC_MOVEMENT, args={
      "id" : id
  })

def insert_cc_movement(bank, fingerprint, date, amount, description, user):
  print({
        "user" : user,
        "description" : description,
        "amount" : amount,
        "bank" : bank,
        "fingerprint" : fingerprint,
        "date" : date
    })
  execute(INSERT_CC_MOVEMENT, args={
        "user" : user,
        "description" : description,
        "amount" : amount,
        "bank" : bank,
        "fingerprint" : fingerprint,
        "date" : date
    })