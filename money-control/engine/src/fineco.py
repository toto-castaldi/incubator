import pandas as pd
import utils

logger = utils.init_log()

def import_xlsx(file_name) :
    dfs = pd.read_excel(file_name, sheet_name=None)

    print(dfs)

