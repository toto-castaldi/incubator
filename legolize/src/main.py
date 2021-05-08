import sys
import utils
import image_input

logger = utils.init_log()

def legolize(image_file_name, w, h):
    for p in image_input.pixels(image_file_name, h, w):
        logger.debug(p)


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
    legolize(image_file_name, w, h)

if __name__ == "__main__":
    cli()