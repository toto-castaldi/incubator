import os
import utils
import re
import fineco

logger = utils.init_log()

importers = {
    r".*-cc-fineco.xlsx$" : fineco.import_cc_xlsx,
    r".*-card-fineco.xls$" : fineco.import_card_xls
}

def import_files(basepath, user):
    for entry in os.listdir(basepath):
        if os.path.isfile(os.path.join(basepath, entry)):
            logger.debug(entry)
            for re_val, imp in importers.items():
                if re.match(re_val, entry):
                    logger.info(f"{entry} is a known file")
                    importers[re_val](os.path.join(basepath, entry), user)