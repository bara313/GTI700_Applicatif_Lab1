const express = require('express');
var CircularBuffer = require("circular-buffer");
const app = express();
const port = 8080;
var temperatureBuffer = new CircularBuffer(720)

const { spawn } = require('node:child_process');
const ls = spawn('python', ['-u', './temperature.py']);

ls.stdout.on('data', (data) => {
	temperatureBuffer.enq(json.parse(data))
});

ls.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});





app.get('/', (req, res) => res.send('Hello World!: ' + temp))

app.get('/sensors/temperature', (req, res) => res.send(temperatureBuffer.get(0)))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


