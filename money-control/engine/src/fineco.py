import pandas as pd
import utils
from cc_movement import CC_Movement

logger = utils.init_log()

def import_xlsx(file_name) :
    xlsx = pd.read_excel(file_name, sheet_name=None)

    sheet = xlsx.get('Organization')

    for indexrow, row in sheet.iterrows():
        if indexrow > 6:
            date = row.get(0)
            in_amount = row.get(1)
            out_amount = row.get(2)
            desc = row.get(3)
            full_desc = row.get(4)
            print(date, in_amount, out_amount, desc, full_desc)
            the_cc_movment = CC_Movement('FINECO', date, in_amount if out_amount == 'nan' else out_amount, desc + " " + full_desc)
            the_cc_movment.save_on_db()
            
    

