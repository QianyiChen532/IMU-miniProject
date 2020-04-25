## IMU-Mini Project


# IMU Web Client Examples

This directory contains example programs, that use the
[imu-tools](https://www.npmjs.com/package/imu-tools) npm package to connect to
an ESP32 that is running either the MicroPython code in
[imu-tools](https://github.com/osteele/imu-tools), or the Arduino (C++) code in
[Arduino-BLE-IMU](https://github.com/osteele/Arduino-BLE-IMU).

## A Guide to the examples

(If you run a server at port 5500, as above, you can click on the example names
below in order to open them in a browser.)

[`index.html`](http://127.0.0.1:5500) displays a list of examples in this directory.

[`sketch.html`](http://localhost:5500/sketch.html) is simple p5.js sketch that
displays the Euler angles. Use it as a starter templtate for writing p5.js
sketches that use the IMU.

[`chart.html`](http://127.0.0.1:5500/chart.html) uses [HighCharts](https://www.highcharts.com)
to display another live graph, that automatically scales the *y* axis as data
arrives.

## Additional reading

See the [npm imu-tools README](https://www.npmjs.com/package/imu-tools) for
additional documentation for the IMU connection code.

## License

MIT
