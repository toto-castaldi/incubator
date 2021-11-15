import db

class CC_Movement:

    def __init__(self, bank, date, amount, description):
        self.date = date
        self.amount = amount
        self.description = description
        self.bank = bank
        self.fingerprint = hash(str(date) + str(amount) + description)

    def save_on_db(self, user):
        db.insert_cc_movement(self.bank, self.fingerprint, self.date, self.amount, self.description, user)