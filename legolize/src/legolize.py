from PIL import Image
import utils

logger = utils.init_log()


class Lego_Image:
    def __init__(self, w, h, original_size, new_size, points):
        self.w = w
        self.h = h
        self.original_size = original_size
        self.new_size = new_size
        self.points = points


def load(image_file_name, w, h):
    image = Image.open(image_file_name)
    logger.debug(f"{image.format}, {image.size}, {image.mode}")
    new_size = (image.size[0] // w, image.size[1] // h)
    logger.debug(f"new size {new_size}")
    points = []
    new_y = 0
    for y in range(h // 2, image.size[1], h):
        new_x = 0
        for x in range(w // 2, image.size[0], w):
            pixel = image.getpixel((x, y))
            if new_x < new_size[0] and new_y < new_size[1]:
                points.append(((new_x, new_y), pixel))
            new_x = new_x + 1
        new_y = new_y + 1

    return Lego_Image(w, h, image.size, new_size, points)
