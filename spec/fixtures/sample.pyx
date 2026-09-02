# Grammar assertions for Cython.
# <- comment.line.number-sign.cython
# <- punctuation.definition.comment.cython

from libc.math cimport sqrt
# <- keyword.control.cython
#              ^ keyword.control.cython

cdef struct Point:
# <- keyword.control.cython
#    ^ keyword.control.cython
#           ^ support.class.cython
    double x
    # <- support.storage.type.cython

cdef double distance(Point point):
# <- keyword.control.cython
#    ^ support.storage.type.cython
#           ^ entity.name.function.cython
#                    ^ support.storage.type.cython
    cdef double squared = point.x * point.x
    #    ^ support.storage.type.cython
    #                   ^ keyword.operator.cython
    return sqrt(squared)
    # <- keyword.control.cython
           # ^ entity.name.function.cython

cpdef int add(int left, int right=1):
# <- keyword.control.cython
#     ^ support.storage.type.cython
#         ^ entity.name.function.cython
    return left + right
    #           ^ keyword.operator.cython

pattern = re.compile("^[A-Z]+\n$")
#       ^ keyword.operator.cython
#                    ^ string.quoted.double.cython
#                             ^ constant.character.escape.cython
