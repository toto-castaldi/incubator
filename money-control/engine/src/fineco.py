import pandas
import numpy 
import utils
import datetime
from cc_movement import CC_Movement

logger = utils.init_log()

def import_xlsx(file_name, user) :
    xlsx = pandas.read_excel(file_name, sheet_name=None)

    sheet = xlsx.get('Organization')

    for indexrow, row in sheet.iterrows():
        if indexrow > 6:
            date = datetime.datetime.strptime(row.get(0), '%d/%m/%Y')
            in_amount = row.get(1)
            out_amount = row.get(2)
            desc = row.get(3)
            full_desc = row.get(4)

            amount = float(in_amount if  numpy.isnan(out_amount) else out_amount)

            the_cc_movment = CC_Movement('FINECO', date, amount, str(desc) + " " + str(full_desc))
            the_cc_movment.save_on_db(user)
            
    

