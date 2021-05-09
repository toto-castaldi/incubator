import legolize
from PIL import Image

def create_image(lego_image):
    new_image = Image.new('RGB', lego_image.new_size)
    for p in lego_image.points:
        new_image.putpixel(p[0], p[1])
    return new_image
