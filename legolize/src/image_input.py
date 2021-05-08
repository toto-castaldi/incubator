from PIL import Image
import utils

logger = utils.init_log()

def pixels(image_file_name, w, h):
    image = Image.open(image_file_name)
    logger.debug(f"{image.format}, {image.size}, {image.mode}")
    for y in range(h // 2, image.size[1], h ):
        for x in range(w // 2, image.size[0], w ):
            pixel = image.getpixel((x,y))
            yield (x, y, pixel)