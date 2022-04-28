from tkinter import *
import time

def init_gui(title, width = 800, height = 600):
    
    window = Tk()

    window.title(title)

    window.geometry(f"{width}x{height}")


    window.rowconfigure(0, weight=1)
    window.columnconfigure(0, weight=1)

    canvas = Canvas(window)
    canvas.grid(row=0, column=0, sticky="nsew")

    return window, width, height, canvas

def start_gui(window):
    window.mainloop()

def print_array(width, height, canvas, arr, sleep_seconds=0.2, red=None ):
    time.sleep(sleep_seconds)

    canvas.delete("all")

    writeable_height = height * 0.9
    writeable_width = width * 0.9

    for index, a in enumerate(arr):
        left_x = writeable_width * 0.05 + index * writeable_width / len(arr) + writeable_width * 0.02
        bottom_y = writeable_height + writeable_height * 0.05
        color = "red" if red is not None and index == red else "blue"

        canvas.create_rectangle(
            left_x,
            bottom_y,
            left_x + writeable_width / len(arr) - writeable_width * 0.04,
            bottom_y - writeable_height * a / 100,
            fill=color
        )

    canvas.update()

def write_and_print_array(arr, index, new_value, width, height, canvas, red, sleep_seconds=0.2):
    write_array(arr, index, new_value)
    print_array(width, height, canvas, arr, sleep_seconds, red)

def read_array(arr, index):
    return arr[index - 1]

def write_array(arr, index, new_value):
    arr[index - 1] = new_value

def inclusive_range(start, end):
    for i in range(start, end + 1):
        yield i
