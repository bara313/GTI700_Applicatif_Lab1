const express = require('express');
var CircularBuffer = require('circular-buffer');
const app = express();
const port = 8080;
var temperatureBuffer = new CircularBuffer(720)

const { spawn } = require('node:child_process');
const ls = spawn('python', ['-u', './temperature.py']);

ls.stdout.on('data', (data) => {
	console.log(`stderr: ${data}`);
	try {
		temperatureBuffer.enq(JSON.parse(`${data}`))
	} catch (error) {
		console.error("Error: Invalid data from sensor")
	}
	
});

ls.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});

app.get('/', (req, res) => res.send('Hello World!: ' + temperatureBuffer.get(0)))

app.get('/sensors/temperature', (req, res) => res.json(temperatureBuffer.get(0)))

app.get('/sensors/temperature/:nb([0-9]+)', function (req, res){
	nb = parseInt(req.params.nb)
  	try {
		if(nb<1){
			throw error
		}
		if(nb >temperatureBuffer.size()){
			nb=temperatureBuffer.size()
		}
		res.json(temperatureBuffer.get(0,nb-1))
  	} catch (error) {
		res.status(400).send({message:'Yikes, something went wrong'})
	}
	
	})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


