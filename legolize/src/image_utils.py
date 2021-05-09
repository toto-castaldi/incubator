from PIL import Image
import logging
import color_utils
import utils
from itertools import islice


logger = utils.init_log()


def move_image_color(image_file_name, color_destination):

    cr = color_ranking(image_file_name)
    distance = color_utils.distance(
        color_destination, list(islice(cr.keys(), 1))[0])

    translation_map = {}
    for c in cr.keys():
        translation_map[c] = color_utils.move(c, distance)

    image = change_colors(image_file_name, translation_map)
    return image


def color_ranking(image_file_name):
    ranking = {}
    image = Image.open(image_file_name)
    for y in range(image.size[1]):
        for x in range(image.size[0]):
            pixel = image.getpixel((x, y))
            ranking[pixel] = ranking[pixel] + \
                1 if pixel in ranking.keys() else 1
    return {k: v for k, v in sorted(ranking.items(), key=lambda item: item[1], reverse=True)}


def change_colors(image_file_name, translation_map):
    image = Image.open(image_file_name)
    for y in range(image.size[1]):
        for x in range(image.size[0]):
            pixel = image.getpixel((x, y))
            if pixel in translation_map.keys():
                image.putpixel((x, y), translation_map[pixel])
    return image
