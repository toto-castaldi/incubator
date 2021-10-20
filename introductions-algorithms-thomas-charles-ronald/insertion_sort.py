import numpy
from common import *

a = numpy.random.randint(1,101,10)

print(a)

for j in range(2, len(a) + 1):
    key = read_array(a, j)
    i = j - 1
    while i > 0 and read_array(a, i) > key:
        write_array(a, i+1, read_array(a, i))
        i = i - 1
    write_array(a, i+1, key)

print(a)
