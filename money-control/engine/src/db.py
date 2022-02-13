import psycopg2
from psycopg2.extras import RealDictCursor
import utils

logger = utils.init_log()

conn = None
connection_param = None

## INSERT

INSERT_CARD_USAGE = """
                    INSERT INTO "card-usage"
                    ("user", "description", "amount", "tag")
                    VALUES(
                      %(user)s, %(description)s, %(amount)s, %(tag)s
                    )  RETURNING id
                    """

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

## SELECT

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

SEARCH_UNMAPPED_CC_MOVEMENT = """
                      select * from "unmapped-cc-movement" where "user" = %(user)s order by date 
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

SEARCH_CARD_USAGE_ID_USER = """
                      select * 
                      from "card-usage"
                      where "user" = %(user)s and "id" = %(id)s
                      ;"""

DELTA_DAYS_ID_USER = """
                      select max(date) - min(date) as delta from "consolidated-expenditure" where "user" = %(user)s
                      ;"""

SUM_ID_USER = """
                      select sum(amount) as sum from "consolidated-expenditure" where "user" = %(user)s
                      ;"""

SEARCH_EXPENDITURE =  """
                      select * from "consolidated-expenditure" ce where "user" = %(user)s and date >= (now() - INTERVAL %(delta_days)s) order by DATE desc;
                      """

DELTA_DAYS_ID_USER_FROM_TO = """
                      select max(date) - min(date) as delta from "consolidated-expenditure" where date >= %(from)s and date <= %(to)s and "user" = %(user)s
                      ;"""

BUDGET_TOTAL_DAYS = """
                      select (%(total)s - sum(amount)) as budget from "consolidated-expenditure" ce where date >= (now() - INTERVAL %(delta_days)s) and "user" = %(user)s
                      ;"""

EXPENDITURE_DAYS_GROUP = """
                      select sum(amount) as total, tag from "consolidated-expenditure" ce where date >= (now() - INTERVAL %(delta_days)s) and "user" = %(user)s group by tag order by total desc 
                      ;"""

SUM_ID_USER_FROM_TO = """
                      select sum(amount) as sum from "consolidated-expenditure" where date >= %(from)s and date <= %(to)s and "user" = %(user)s
                      ;"""

MAX_DATE = """
                      select max(date) from "consolidated-expenditure" where "user" = %(user)s
                      ;"""

SUM_ID_USER_DELTA_DAYS = """
                      select sum(amount) from "consolidated-expenditure" ce where date >= (%(max_date)s - INTERVAL %(delta_days)s) and "user" = %(user)s
                      ;"""

TOTAL_BY_TAG = """
                      select sum(amount) as total, tag from "consolidated-expenditure" ce where "user" = %(user)s group by tag order by total desc
                      ;"""      

TOTAL_FROM_IN_TAGS = """
                      select * from "consolidated-expenditure" where "user" = %(user)s and date >= %(date_from)s and tag in ({}) order by date desc
                      ;"""

## DELETE

DELETE_MAP = """
                      delete 
                      from "usage-to-movement"
                      where "usage_id" = %(usage_id)s
                      ;"""

DELETE_CC_MOVEMENT = """
                      delete 
                      from "cc-movement"
                      where "id" = %(id)s
                      ;"""


## UPDATE

UPDATE_CARD_USAGE_DISCOUNT = """
                      update "card-usage"
                      set "discount" = %(discount)s
                      where "id" = %(id)s
                      ;"""

UPDATE_CARD_USAGE_TAG = """
                      update "card-usage"
                      set "tag" = %(tag)s
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


def execute(query, args={}, format=None, returning=False):
  with get_conn() as conn:   
    with conn.cursor() as cursor:
      if format:
        query = query.format(*format)
      cursor.execute(query, args)
      if returning:
        return cursor.fetchone()

def like_term(term):
  term= term.replace('=', '==').replace('%', '=%').replace('_', '=_')
  like = ('%'+term+'%').upper()
  return like

def insert_card_usage(amount, description, user, tag):
  cursor = execute(INSERT_CARD_USAGE, args={
      "user" : user,
      "description" : description,
      "amount" : amount,
      "tag" : tag
  }, returning=True)
  return cursor['id']

def map_movement_usage(card_usage_id, cc_movement_id):
  execute(INSERT_MAPPING, args={
      "card_usage_id" : card_usage_id,
      "cc_movement_id" : cc_movement_id
  })

def total_by_tag(user):
  return list(map(lambda el : { "total" : el["total"], "tag" : el["tag"]}, fetch(TOTAL_BY_TAG, args={
      "user" : user
  }, all=True)))

def total_from_in_tags(user, date_from, tags):
  query = TOTAL_FROM_IN_TAGS.format(', '.join(list(map(lambda el : f"'{el}'", tags))))
  logger.debug(query)
  logger.debug(date_from)
  return list(map(lambda el :  {  "date" : el["date"], "tag" : el["tag"], "description" : el["description"], "amount" : el["amount"]}, fetch(query, args={
      "user" : user,
      "date_from" : date_from
  }, all=True)))

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

def unmapped_cc_movement(user):
  return list(map(lambda el : { "description" : el["description"], "amount" : el["amount"], "bank" : el["bank"], "date" : el["date"] }, fetch(SEARCH_UNMAPPED_CC_MOVEMENT, args={
      "user" : user
  }, all=True)))

def expenditure(user, delta_days):
  return list(map(lambda el : { "description" : el["description"], "amount" : el["amount"], "full_desc" : el["full_desc"], "date" : el["date"] }, fetch(SEARCH_EXPENDITURE, args={
      "user" : user,
      "delta_days" : delta_days
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

def search_card_usage_id_user(id, user):
  return fetch(SEARCH_CARD_USAGE_ID_USER, args={
      "user" : user,
      "id" : id
  })

def budget_days(user, total, delta_days):
  return fetch(BUDGET_TOTAL_DAYS, args={
        "user" : user,
        "total" : total,
        "delta_days" : delta_days
    })

def expenditure_group(user, delta_days):
  return fetch(EXPENDITURE_DAYS_GROUP, args={
        "user" : user,
        "delta_days" : delta_days
    }, all=True)

def whole_delta_days(user, query_from, query_to):
  if query_from is not None and query_to is not None:
    return fetch(DELTA_DAYS_ID_USER_FROM_TO, args={
        "user" : user,
        "from" : query_from,
        "to" : query_to
    })
  else:
    return fetch(DELTA_DAYS_ID_USER, args={
        "user" : user,
    })

def whold_sum_amount(user, query_from, query_to, delta_days):
  if query_from is not None and query_to is not None:
    return fetch(SUM_ID_USER_FROM_TO, args={
        "user" : user,
        "from" : query_from,
        "to" : query_to
    })
  elif delta_days is not None:
    logger.debug(f"user {user}")
    max_date = fetch(MAX_DATE, args={
        "user" : user
    })['max']
    logger.debug(f"max_date {max_date}")
    return fetch(SUM_ID_USER_DELTA_DAYS, args={
        "user" : user,
        "max_date" : max_date,
        "delta_days" : delta_days
    })
  else:
    return fetch(SUM_ID_USER, args={
        "user" : user
    })

def delete_map(usage_id):
  execute(DELETE_MAP, args={
      "usage_id" : usage_id
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

def apply_discount_card_usage_id(id, discount):
  execute(UPDATE_CARD_USAGE_DISCOUNT, args={
      "id" : id,
      "discount" : discount
  })

def apply_tag_card_usage_id(id, tag):
  execute(UPDATE_CARD_USAGE_TAG, args={
      "id" : id,
      "tag" : tag
  })