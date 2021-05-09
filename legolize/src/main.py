import sys
import utils
import legolize
import image_output
from itertools import islice


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

    #sampling
    logger.debug(f"{image_file_name} {w} {h}")
    lego_image = legolize.load(image_file_name, w, h)
    image = image_output.create_image(lego_image)
    image.save("output.png")

    #colorize lego points
    color_ranking = utils.color_ranking("lego-point.png")
    #first_color_ranking = list(islice(color_ranking.items(), 30))
    logger.info(color_ranking, list(islice(color_ranking.items(), 1)))
    #logger.info(first_color_ranking)
    color_destination = utils.html_to_rgb("C91A09", 255)
    distance = utils.distance(color_destination, list(islice(color_ranking.keys(), 30))[0])

    translation_map = {}
    for c in color_ranking.keys():
        translation_map[c] = utils.move(c, distance)
    
    logger.info(translation_map)
    image = utils.change_colors("lego-point.png", translation_map)
    image.save("lego-point-C91A09.png")

if __name__ == "__main__":
    cli()