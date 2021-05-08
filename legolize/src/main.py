import sys
from PIL import Image
import utils

logger = utils.init_log()

def legolize(image_file_name, h, w):
    image = Image.open(image_file_name)
    logger.debug(f"{image.format}, {image.size}, {image.mode}")
    for x in range(image.size[0]):
        for y in range(image.size[1]):
            pixel = image.getpixel((x,y))
            logger.debug(f"{x}, {y}, {pixel}")


def cli():
    opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
    args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]

    image_file_name  = None
    w = 10
    h = 20

    for opt in enumerate(opts):
        if "-f" == opt[1]:
            image_file_name = args[opt[0]]
        if "-w" == opt[1]:
            w = int(args[opt[0]])
        if "-h" == opt[1]:
            h = int(args[opt[0]])
        
    if image_file_name is None:
        raise SystemExit(f"Usage: {sys.argv[0]} -f [image_file_name]")

    logger.debug(f"{image_file_name} {w} {h}")
    #legolize(image_file_name)

if __name__ == "__main__":
    cli()