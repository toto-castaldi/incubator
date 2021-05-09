import legolize
import image_utils
import color_utils
import utils
from PIL import Image


logger = utils.init_log()

def create_image_with_pixel(lego_image):
    new_image = Image.new('RGB', lego_image.new_size)
    for p in lego_image.points:
        new_image.putpixel(p[0], p[1])
    return new_image


def create_image_with_image(lego_image):
    pixel_to_image_x = 62
    pixel_to_image_y = 62
    palette = {}
    new_image = Image.new(
        'RGB', (lego_image.new_size[0] * pixel_to_image_x, lego_image.new_size[1] * pixel_to_image_y))
    count = 0
    for p in lego_image.points:
        position = p[0]
        color = p[1]
        if color in palette.keys():
            pixel_image = palette[color]
            logger.info("color exists !!!")
        else:
            pixel_image = image_utils.move_image_color("lego-point.png", color)
            palette[color] = pixel_image
        
        logger.info(f"palette size {len(palette)}")
        logger.info(f"{count} on {len(lego_image.points)}")

        pixel_image_dimension_x = pixel_image.size[0]
        pixel_image_dimension_y = pixel_image.size[1]
        for x in range(pixel_image_dimension_x):
            for y in range(pixel_image_dimension_y):
                new_x = position[0] * pixel_image_dimension_x + x
                new_y = position[1] * pixel_image_dimension_y + y
                new_image.putpixel(
                    (new_x, new_y), pixel_image.getpixel((x, y)))
        count = count + 1
    return new_image
