import os
import utils
import re
import fineco

logger = utils.init_log()

basepath = os.environ.get("INPUT_FOLDER")

importers = {
    r".*fineco.*\.xlsx$" : fineco.import_xlsx
}

for entry in os.listdir(basepath):
    if os.path.isfile(os.path.join(basepath, entry)):
        logger.debug(entry)
        for re_val, imp in importers.items():
            if re.match(re_val, entry):
                logger.info(f"{entry} is a known CC movement file")
                importers[re_val](os.path.join(basepath, entry))