import numpy as np
import math as math
import numpy.linalg as linalg

class NewtonSolver:
    def __init__(self, fun, delta, tolerance):
        self._fun = fun
        self._delta = delta
        self._tolerance = tolerance
    
    def _jacobi(self, x):
        n = len(x)
        jac = np.zeros((n, n))
        f0 = np.zeros((n,))
        two_delta = 2 * self._delta
        xj_pluss = np.copy(x)
        xj_minus = np.copy(x)
        f0 = self._fun(x)
        f_pluss = np.copy(f0)
        f_minus = np.copy(f0)
        
        for j in range(n):
            xj_pluss[j] = xj_pluss[j] + self._delta        
            xj_minus[j] = xj_minus[j] - self._delta        
            f_pluss = self._fun(xj_pluss)
            f_minus = self._fun(xj_minus)
            xj_pluss[j] = x[j]
            xj_minus[j] = x[j]
            
            for i in range(n):
                jac[i,j] = (f_pluss[i] - f_minus[i]) / (two_delta)
            
        return jac

    def _next(self, x_n):
        a = self._jacobi(x_n)
        b = np.multiply(self._fun(x_n), -1)
        delta_x = linalg.solve(a, b)
        x_np1 = np.add(x_n, delta_x)
        f_np1 = self._fun(x_np1)
        error = linalg.norm(f_np1)
        return (x_np1, error)

    def solve(self, x_0, max_iterations, do_print = False):
        xn = x_0
        error = linalg.norm(self._fun(xn))
        n = 0
        if do_print:
            print("n = ", n, ", x_n", xn, ", error =", error)

        while(error > self._tolerance and n < max_iterations):
            (xnp1, error) = self._next(xn)
            n = n + 1
            xn = xnp1
            if do_print:
                print("n = ", n, ", x_n", xn, ", error =", error)

        return (xn, error)
            
def _test_1_fun(xs):
    x = xs[0]
    y = xs[1]
    f = np.zeros((2,))
    f[0] = y - x*x
    f[1] = y - x
    return f

def test_1():
    nsolver = NewtonSolver(_test_1_fun, 0.05, 1.0e-6)
    x0 = np.zeros((2,))
    x0[0] = 0.8
    x0[1] = 0.8
    
    (x, error) = nsolver.solve(x0, 4, do_print = True)
    print(x)
    print(error)

#test_1()
    
