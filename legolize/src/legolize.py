from PIL import Image
import utils
import tempfile

logger = utils.init_log()

def pixels(image_file_name, w, h):
    image = Image.open(image_file_name)
    logger.debug(f"{image.format}, {image.size}, {image.mode}")
    new_size = (image.size[0] // w, image.size[1] // h)
    logger.debug(f"new size {new_size}")
    new_image = Image.new('RGB', new_size)
    new_y = 0
    for y in range(h // 2, image.size[1], h ):
        new_x = 0
        for x in range(w // 2, image.size[0], w ):
            pixel = image.getpixel((x,y))
            if new_x < new_size[0] and new_y < new_size[1]:
                new_image.putpixel((new_x, new_y), pixel)
            new_x = new_x + 1
        new_y = new_y + 1
    file_name = next(tempfile._get_candidate_names()) + ".png"
    new_image.save(file_name)
    logger.debug(file_name)
    return new_image