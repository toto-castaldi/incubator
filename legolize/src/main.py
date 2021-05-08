import sys
import utils
import legolize

logger = utils.init_log()

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
    legolize.pixels(image_file_name, w, h)

if __name__ == "__main__":
    cli()