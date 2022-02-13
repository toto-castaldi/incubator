import db
import utils
import hashlib

logger = utils.init_log()

class CC_Movement:

    def __init__(self, bank, date, amount, description):
        self.date = date
        self.amount = amount
        self.description = description
        self.bank = bank
        self.fingerprint = hashlib.md5((str(date) + str(amount) + description).encode('utf-8')).hexdigest()

    def save_on_db(self, user):
        movement = db.search_cc_movement(self.bank, self.fingerprint, user)
        if movement:
            logger.info(f"{self.date} {self.description} {self.amount} already present. SKIP")
        else:
            db.insert_cc_movement(self.bank, self.fingerprint, self.date, self.amount, self.description, user)