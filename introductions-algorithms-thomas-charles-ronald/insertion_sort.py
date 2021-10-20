import numpy
from common import *
from tkinter import *

window = Tk()

window.title("Insertion sort")

window.rowconfigure(0, weight=1)
window.columnconfigure(0, weight=1)

canvas = Canvas(window)
canvas.grid(row=0, column=0, sticky="nsew")

a = numpy.random.randint(1,101,10)

def print_array(canvas, arr):
    height = canvas.winfo_reqheight() * 0.9
    width = canvas.winfo_reqwidth() * 0.9

    for index, a in enumerate(arr):
        canvas.create_rectangle(width * 0.1  + index * width / len(arr) , height + height * 0.05, width / len(arr) + (index + 1) * width / len(arr) - width * 0.05, height * 0.05 + height * a / 100, fill='blue')

print_array(canvas, a)

for j in range(2, len(a) + 1):
    key = read_array(a, j)
    i = j - 1
    while i > 0 and read_array(a, i) > key:
        write_array(a, i+1, read_array(a, i))

        print_array(canvas, a)

        i = i - 1
    write_array(a, i+1, key)

print(a)

window.mainloop()
