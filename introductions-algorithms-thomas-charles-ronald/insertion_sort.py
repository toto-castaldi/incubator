## PAG 3

from time import sleep
import numpy
from common import *
from tkinter import *

slp = 0.5
window, width, height, canvas = init_gui("Insertion sort")

arr = numpy.random.randint(1,101,20)

print_array(width, height, canvas, arr)

sleep(slp)

for j in inclusive_range(2, len(arr)):
    key = read_array(arr, j)
    i = j - 1
    while i > 0 and read_array(arr, i) > key:
        #arr[i+i] = arr[i]
        write_array(arr, i+1, read_array(arr, i))
        print_array(width, height, canvas, arr, red=i)

        i = i - 1

    #arr[i+1] = key
    write_array(arr, i+1, key)
    print_array(width, height, canvas, arr)


start_gui(window)
