const express = require('express');
var CircularBuffer = require('circular-buffer');
const app = express();
const port = 8080;
var temperatureBuffer=new CircularBuffer(720)
var humidityBuffer = new CircularBuffer(720)

const { spawn } = require('node:child_process');
const temperature_process = spawn('python', ['-u', './temperature.py']);
const humid_process = spawn('python', ['-u', './humid.py']);





humid_process.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
	try {
		humidityBuffer.enq(JSON.parse(`${data}`))
	} catch (error) {
		console.error("Error: Invalid data from sensor")
	}
	
});

humid_process.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

humid_process.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
}); 


temperature_process.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
	try {
		temperatureBuffer.enq(JSON.parse(`${data}`))
	} catch (error) {
		console.error("Error: Invalid data from sensor")
	}
	
});

temperature_process.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

temperature_process.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
}); 

app.get('/', (req, res) => res.send('Howdy'))
app.get('/sensors/temperature', (req, res) => res.json(temperatureBuffer.get(0)))

app.get('/sensors/temperature/:nb([0-9]+)', function (req, res){
	nb = parseInt(req.params.nb)
  	try {
		if(nb<1){
			return res.status(400).send({message:'This aint a good request pal'})
		}
		if(nb >temperatureBuffer.size()){
			nb=temperatureBuffer.size()
		}
		
		res.json(temperatureBuffer.get(0,nb-1))
  	} catch (error) {
		res.status(500).send({message:'Yikes, something went wrong'})
	}
	
	})

app.get('/sensors/temperature/:nb([0-9]+)/avg', function (req, res){
	
	try {
		nb = parseInt(req.params.nb)
		if(nb<1){
			return res.status(400).send({message:'This aint a good request pal'})
			
		}
		if(nb >temperatureBuffer.size()){
			nb=temperatureBuffer.size()
		}
	
		arr = temperatureBuffer.get(0,nb-1)

		const sum = arr.reduce((accumulator, value) => {
			return accumulator + parseFloat(value.temperature);
		}, 0);
		
		res.json(sum/nb)
	} catch (error) {
		res.status(500).send({message:'Yikes, something went wrong'})
	}

	})

app.get('/sensors/humidity', (req, res) => res.json(humidityBuffer.get(0)))

app.get('/sensors/humidity/:nb([0-9]+)', function (req, res){
	nb = parseInt(req.params.nb)
  	try {
		if(nb<1){
			return res.status(400).send({message:'This aint a good request pal'})
		}
		if(nb >humidityBuffer.size()){
			nb=humidityBuffer.size()
		}
		
		res.json(humidityBuffer.get(0,nb-1))
  	} catch (error) {
		res.status(500).send({message:'Yikes, something went wrong'})
	}
	
	})

app.get('/sensors/humidity/:nb([0-9]+)/avg', function (req, res){
	
	try {
		nb = parseInt(req.params.nb)
		if(nb<1){
			return res.status(400).send({message:'This aint a good request pal'})
			
		}
		if(nb >humidityBuffer.size()){
			nb=humidityBuffer.size()
		}
	
		arr = humidityBuffer.get(0,nb-1)

		const sum = arr.reduce((accumulator, value) => {
			return accumulator + parseFloat(value.humidity);
		}, 0);
		
		res.json(sum/nb)
	} catch (error) {
		res.status(500).send({message:'Yikes, something went wrong'})
	}

	})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


