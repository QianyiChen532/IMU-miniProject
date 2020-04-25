# IMU-Mini Project

## Concept
Combining the movement of my hand when playing the music instrument (called "Pipa" in Chinese) to the movement of leaves. Exploring new ways of visualizing music not only through the sound but also the movement of playing the music instrument.

## Development
- p5 sketch:
I spent some time learning about the recursive structure of the tree. The initial idea is to also apply the wind force to the branch of the tree but I haven't figure it out yet. When the leaves are still on the branch, it will have the swing movement (implemented by the rotation). If the data is higher than certain threshold, the force will be triggered.

- Input Data
I only get a rough sense of how it works through my limited knowledge of linear algebra. The euler angle is relatively more straight forward, but the gimbal lock is. Thanks to the highcharts example, I was able to find a pattern for my input data.

- Combination

leave movement: gravity, wind, rotation.
data: quaternion data, acceleration data.

I main used the map function to control the input data. And also set threshold to control the state change.

## Struggles && Further Development
- Understand how the quaternion works.
- More stable data input
- More organic movement

# About the IMU Web Client Examples

See [IMU Web Client Examples](https://github.com/osteele/imu-client-examples) Repo

## License

MIT
