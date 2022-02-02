import time
import os
import schedule
import utils
import db
import coinbase


logger = utils.init_log()

def job():
    logger.info("coinbase")
    accounts = db.load_all_accounts()
    for account in accounts:
        logger.debug(account)
        account_transactions = coinbase.load_all_transactions(account)
        logger.debug(account_transactions)
        db.merge_transactions(account, account_transactions)



if os.getenv("ENV", None) == "DEV":
    job()
else:
    db.connection_param["host"] = "postgresql"
    if __name__ == '__main__':
        schedule.every(10).seconds.do(job)
        #schedule.every(10).minutes.do(job)
        #schedule.every().hour.do(job)
        #schedule.every().day.at("10:30").do(job)
        #schedule.every(5).to(10).minutes.do(job)
        #schedule.every().monday.do(job)
        #schedule.every().wednesday.at("13:15").do(job)
        #schedule.every().minute.at(":17").do(job)

        while True:
            schedule.run_pending()
            time.sleep(1)