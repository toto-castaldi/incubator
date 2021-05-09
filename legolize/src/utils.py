from PIL import Image
import logging
import os

LOG_LEVELS = {
    'INFO': 20,
    'DEBUG': 10,
    'WARNING': 30,
    'ERROR': 40,
    'CRITICAL': 50
}

log_level = LOG_LEVELS.get(os.environ.get('LOG_LEVEL', 'INFO'))

logger_handler = False


def color_ranking(image_file_name):
    ranking = {}
    image = Image.open(image_file_name)
    for y in range(image.size[1]):
        for x in range(image.size[0]):
            pixel = image.getpixel((x, y))
            ranking[pixel] = ranking[pixel] + \
                1 if pixel in ranking.keys() else 1
    return {k: v for k, v in sorted(ranking.items(), key=lambda item: item[1], reverse=True)}

def html_to_rgb(html_code, alpha=None):
    r = int(html_code[0:2], 16)
    g = int(html_code[2:4], 16)
    b = int(html_code[4:6], 16)
    if alpha:
        return (r, g, b, alpha)
    else:
        return (r, g, b)

def change_colors(image_file_name, translation_map):
    image = Image.open(image_file_name)
    for y in range(image.size[1]):
        for x in range(image.size[0]):
            pixel = image.getpixel((x, y))
            if pixel in translation_map.keys():
                image.putpixel((x, y), translation_map[pixel])
    return image

def distance(colorA, colorB):
    if len(colorA) > 3:
        return (colorA[0] - colorB[0], colorA[1] - colorB[1], colorA[2] - colorB[2], colorA[3] - colorB[3])
    else:
        return (colorA[0] - colorB[0], colorA[1] - colorB[1], colorA[2] - colorB[2])

def limit(i, min, max):
    i = i if i > 0 else 0
    i = i if i < 256 else 255
    return i

def move(color, distance):
    r = color[0] + distance[0]
    g = color[1] + distance[1]
    b = color[2] + distance[2]
    a = None
    if len(color) > 3:
        a = color[3] + distance[3]
    r = limit(r, 0, 255)
    g = limit(g, 0, 255)
    b = limit(b, 0, 255)
    if a:
        a = limit(a, 0, 255)
    if a:
        return (r, g, b)
    else:
        return (r, g, b, a)


def init_log():

    global logger_handler

    logger = logging.getLogger()
    logger.setLevel(log_level)

    if logger_handler is False:
        ch = logging.StreamHandler()
        ch.setLevel(log_level)

        formatter = logging.Formatter('[%(levelname)s] %(message)s')
        ch.setFormatter(formatter)

        logger.addHandler(ch)

        logger_handler = True

    return logger
