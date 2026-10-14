from libc.math cimport sqrt

cdef struct Point:
    double x

cdef double distance(Point point):
    cdef double squared = point.x * point.x
    return sqrt(squared)

cpdef int add(int left, int right=1):
    return left + right

pattern = re.compile("^[A-Z]+\n$")
