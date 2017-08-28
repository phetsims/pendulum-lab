Pendulum Lab Model
==================

Gravitational Acceleration Constants:
- Gravity of Moon = 1.62 m/s^2
- Gravity of Earth = 9.81 m/s^2
- Gravity of Jupiter = 24.79 m/s^2
- Gravity of Planet X = 14.2 m/s^2

Notation:
- θ: Angle of the pendulum from the resting position, in radians.
- ω: Angular velocity of the pendulum, ω = θ'
- v: Velocity of the pendulum, v = ω * L = θ' * L
- m: Mass of the pendulum, in kg.
- g: Acceleration due to gravity.
- L: Length of the pendulum.
- c: Drag coefficient

Given θ (the angle of the pendulum from the resting position, in radians), there are three forces that we consider:
- Gravity (mg)
- Tension (centripetal force, mv^2/L)
- Drag (c * v^2 * m^(2/3))
      http://fy.chalmers.se/~f7xiz/TIF081C/pendulum.pdf notes squared velocity due to Reynolds number
      surface area increases by m^(2/3), and 'c' is the drag coefficient

The net tangential force = -m * g * sin( θ ) - c * v^2 * m^(2/3)<br>
                        = -m * g * sin( θ ) - c * L^2 * (θ')^2 * m^(2/3)   -- expansion of v = θ' * L <br>
                         = m * (tangential acceleration)<br>
                         = m * L * θ''<br>

Rearranging results in the differential equation:
θ'' + ( c * L / m^(1/3) ) * (θ')^2 + (G/L) * sin( θ ) = 0

Which is then transformed into a system of differential equations and integrated with 4th order Runge Kutta.

Energy:
- Kinetic energy: (1/2) * m * v^2 = 0.5 * m * (L * ω)^2
- Potential energy: Relative to the resting point of the mass, so our 'height' is L * (1 - cos(θ)), with a resulting
energy of m * g * L * (1 - cos(θ)).
- Thermal energy: total - kinetic - potential.

The 'step' button will move forward 10 milliseconds (0.01s).

The Period Timer will time one period trace for a selected pendulum.

The Return button will reset the position of the pendulum, but will not change any settings.

Maximum Pendulum values:
- Length ( 0.10m < L < 1.00m )
- Mass   ( 0.10kg < M < 1.50kg )
- Gravity ( 0.00m/s*s < G < 25.00m/s*s)
