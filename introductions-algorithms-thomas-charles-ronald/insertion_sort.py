from time import sleep
import numpy
from common import *
from tkinter import *

window, width, height, canvas = init_gui()

a = numpy.random.randint(1,101,20)

print_array(width, height, canvas, a)

for j in inclusive_range(2, len(a)):
    key = read_array(a, j)
    i = j - 1
    while i > 0 and read_array(a, i) > key:
        #a[i+i] = a[i]
        write_and_print_array(a, i+1, read_array(a, i), width, height, canvas, i, sleep_seconds=0.1)

        i = i - 1

    #a[i+1] = key
    write_and_print_array(a, i+1, key, width, height, canvas, j, sleep_seconds=0.1)

start_gui(window)
