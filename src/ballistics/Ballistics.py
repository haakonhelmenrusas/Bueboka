import matplotlib.pyplot as plt
import numpy as np
import math as math
from scipy.integrate import solve_bvp, solve_ivp, OdeSolver
from json import JSONDecoder, JSONEncoder
from NewtonSolver import NewtonSolver

class Arrow:
    def __init__(self, type):

        self._arrow_data = {
            "shaft type" : "Easton X10",
            "shaft sub type" : "spine 500",
            "point_type" : "Easton bullet point",
            "vane_type" : "AEV 45mm",
            "nock_type" : "Beiter small 1"
        }

        # Actual data here is just to create an example.
        # Real data are read from a file, which in this case is
        # "arrow_data_Easton X10.json"
        self._arrow_shaft_type = {
            "type" : "Easton X10",
            "parallell" : False,
            "spine" : 500.0,
            "min diameter mm" : 4.0,
            "max diameter mm" : 5.0,
            "shaft mass grain per_inch" : 6.0,
            "point mass grain" : 100.0
        }

        self._arrow_shaft_sub_type = {
            "type" : "spine 500",
            "spine" : 500.0
        }

        self._point_data = {
            "type" : "Easton bullet point",
            "point length mm" : 15.0,
        }

        self._arrow_personal_data
        {
            self._length_cm:0.0
        
        }
        self._type = type
        self._shaft_mass_grain_per_inch = 0.0
        self._point_length_mm = 0.0

    def read_data_from_file(self, type):
        file_name = "arrow_" + self._type + ".json"

    def serialize_to_file(self):
        file_name = "arrow_" + self._type + ".json"

class Ballistics:

    def __init__(self, plot_tracks):
        self._g = 9.81
        self._cd1 = 0.0
        self._cd2 = 0.0
        self._y_at_start = 0.0
        self._t_max = 1.5
        self._t_step = 0.001
        self._hill_angle_deg = 0
        self._arrow_angle_deg = 0
        self._v0 = 0
        self._vx_0 = 0
        self._vy_0 = 0
        self._plot_tracks = plot_tracks

    def initiate(self, arrow_angle_deg, initial_arrow_speed, distance, hill_angle_deg):
        self._arrow_angle_deg = arrow_angle_deg
        self._distance = distance
        self._hill_angle_deg = hill_angle_deg
        
        hill_angle_rad = math.pi / 180.0 * hill_angle_deg
        self._gx = -self._g * math.sin(hill_angle_rad)
        self._gy = -self._g * math.cos(hill_angle_rad)

        self._v0 = initial_arrow_speed
        init_arrow_angle_rad = math.pi / 180.0 * self._arrow_angle_deg
        self._vx_0 = self._v0 * math.cos(init_arrow_angle_rad)
        self._vy_0 = self._v0 * math.sin(init_arrow_angle_rad)

    def get_hill_angle_deg(self):
        return self._hill_angle_deg

    def get_initial_arrow_angle_relative_bow_deg(self):
        return self._arrow_angle_deg

    def _fun(self, t, x):
        f0 = x[2]
        f1 = x[3]
        f2 = self._gx
        f3 = self._gy
        return np.reshape((f0, f1, f2, f3), (4,))

    def _f(self, t, y):
        return np.reshape((y[2], y[3], self._gx, self._gy), (4,))

    def hit_target(self):

        y0 = np.reshape([0, 0, self._vx_0, self._vy_0], (4,))
        t_values = np.arange(0, self._t_max, self._t_step)
        solution = solve_ivp(self._fun, (0, self._t_max), y0, t_eval = t_values,  method = 'RK45', dense_output = True, vectorized = False)
        y_miss = self._find_vertical_miss(solution)

        if self._plot_tracks:
            x = solution.y[0]
            y = solution.y[1]
            plt.plot(x, y)
            plt.grid()

        return y_miss

    def _find_vertical_miss(self, solution):
        hit_index = self._find_hit_index(solution)
        if hit_index < 0:
            return -1
        
        ys = solution.y[1]
        y_miss = self._find_y_miss(ys, hit_index)
        return y_miss

    def _find_hit_index(self, solution):
        xs = solution.y[0]
        x0 = xs[0]
        hit_i = -1
        for i in range(1, len(xs)):
            x1 = xs[i]
            if x1 >= self._distance:
                hit_i = i
                break
        
        hit_index = -1
        if hit_i > 0:
            hit_index = hit_i + (self._distance - x0) / (x1 - x0)
        
        return hit_index

    def _find_y_miss(self, ys, hit_index):
        i0 = round(hit_index)
        i1 = i0 + 1
        if i1 >= len(ys):
            return ys[i0]
        
        y_miss = ys[i0] + (hit_index - i0) * (ys[i1] - ys[i0])
        return y_miss

class Shooter:

    """ Initiate with arrow data
    """
    def __init__(self, hill_angle_deg, plot_tracks = False):
        self._hill_angle_deg = hill_angle_deg
        self._ballistics = Ballistics(plot_tracks = plot_tracks)
        # add arrow data

    """ Calculate arrow angle to hit target at a given distance and arrow speed
    """ 
    def calculate_arrow_angle(self, distance, arrow_speed):
        delta = 0.1
        tolerance = 0.001
        fun = lambda x : self._shooting_zero_fun(x, distance, arrow_speed)
        nsolver = NewtonSolver(fun, delta, tolerance)
        
        arrow_angle_deg_start_guess = 3.0
        x0 = [arrow_angle_deg_start_guess]
        (x, error) = nsolver.solve(x0, 10, do_print = True)

        arrow_angle_deg_solution = x[0]
        return arrow_angle_deg_solution

    def _shooting_zero_fun(self, x, distance, arrow_speed):
        arrow_angle_deg = x[0]
        y_miss = self._shoot_at_target(distance, arrow_angle_deg, arrow_speed)
        return [y_miss]

    def _shoot_at_target(self, distance, arrow_angle_deg, arrow_speed):
        self._ballistics.initiate(arrow_angle_deg, arrow_speed, distance, self._hill_angle_deg)
        y_miss = self._ballistics.hit_target()
        return y_miss

def test():

    hill_angle_deg = 0
    arrow_speed = 60
    distance = 70
    
    shooter = Shooter(hill_angle_deg, plot_tracks=True)
    arrow_angle = shooter.calculate_arrow_angle(distance, arrow_speed)
    print("Arrow angle:", arrow_angle)
    
    plt.show()

test()
