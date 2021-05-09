import sys
import utils
import color_utils
import image_utils
import legolize
import image_output

logger = utils.init_log()

def cli():
    opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
    args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]

    image_file_name  = None
    w = 10
    h = 10

    for opt in enumerate(opts):
        if "-f" == opt[1]:
            image_file_name = args[opt[0]]
        if "-w" == opt[1]:
            w = int(args[opt[0]])
        if "-h" == opt[1]:
            h = int(args[opt[0]])
        
    if image_file_name is None:
        raise SystemExit(f"Usage: {sys.argv[0]} -f [image_file_name]")

    #colorize lego points
    image = image_utils.move_image_color("lego-point.png", color_utils.html_to_rgb("C91A09", 255))
    image.save("lego-point-C91A09.png")

    #sampling
    logger.debug(f"{image_file_name} {w} {h}")
    lego_image = legolize.load(image_file_name, w, h)
    image = image_output.create_image_with_image(lego_image)
    image.save("output.png")

    

if __name__ == "__main__":
    cli()