def binary_sum(a,b):
    sum = []
    prec = 0
    results = {
            (0, 0, 0): (0, 0),
            (0, 0, 1): (0, 1),
            (0, 1, 0): (0, 1),
            (0, 1, 1): (1, 0),
            (1, 0, 0): (0, 1),
            (1, 0, 1): (1, 0),
            (1, 1, 0): (1, 0),
            (1, 1, 1): (1, 1)
        }
    for i in range(max(len(a), len(b))):
        first = a[-(i+1)] if i < len(a) else 0
        second = b[-(i+1)] if i < len(b) else 0
        prec, result = results.get((prec, first, second))
        sum.insert(0, result)
    
    if prec == 1:
        sum.insert(0, prec)

    return sum

assert binary_sum([ 1, 1, 1, 0], [ 1, 1, 1, 1]) == [1, 1, 1, 0, 1]
assert binary_sum([ 1, 0, 1, 0, 1, 0, 1], [ 1, 0, 0, 0, 0, 1]) == [1, 1, 1, 0, 1, 1, 0]
assert binary_sum([ 1, 1, 0, 1], [ 1, 0, 1, 1, 0, 1]) == [1, 1, 1, 0, 1, 0]

print("all test passed")