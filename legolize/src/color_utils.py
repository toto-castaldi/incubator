def html_to_rgb(html_code, alpha=None):
    r = int(html_code[0:2], 16)
    g = int(html_code[2:4], 16)
    b = int(html_code[4:6], 16)
    a = alpha if alpha else 255

    return (r, g, b, a)

def distance(colorA, colorB):
    a = 255
    if len(colorA) > 3 and len(colorB) > 3:
        a = colorA[3] - colorB[3]

    return (colorA[0] - colorB[0], colorA[1] - colorB[1], colorA[2] - colorB[2], a)

def limit(i, min, max):
    i = i if i > 0 else 0
    i = i if i < 256 else 255
    return i

def move(color, distance):
    r = color[0] + distance[0]
    g = color[1] + distance[1]
    b = color[2] + distance[2]
    a = color[3] + distance[3]
    r = limit(r, 0, 255)
    g = limit(g, 0, 255)
    b = limit(b, 0, 255)
    a = limit(a, 0, 255)
    return (r, g, b, a)