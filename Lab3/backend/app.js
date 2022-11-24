

const { spawn } = require('node:child_process');
const mqtt = require('mqtt');

var temperature=0
var humidity=0

const temperature_process = spawn('python', ['-u', './temperature.py']);
const humid_process = spawn('python', ['-u', './humid.py']);

const clientLocal  = mqtt.connect('mqtt://localhost:1883')

clientLocal.on("error",function(error){ console.log("Can't connect"+error)});


clientLocal.on('connect', function () {
	console.log("Connect Public")
  clientLocal.subscribe('presence', function (err) {
    if (!err) {
      clientLocal.publish('presence', 'Hello mqtt')
    }else{
			console.log("oups")
		}
  })
})



humid_process.stdout.on('data', (data) => {
	try {
		humidity=JSON.parse(`${data}`).humidity

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
	try {
		temperature=JSON.parse(`${data}`).temperature
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

function publishData() {
	var newDate = new Date();

	timeStamp =newDate.toISOString()

	payloadTemp={'temperature':temperature,"time":timeStamp}
	payloadHumid={'humidity':humidity,"time":timeStamp}
	console.log(payloadTemp)

	clientLocal.publish('/gti780a2021/equipe04/temperature', JSON.stringify(payloadTemp))
	clientLocal.publish('/gti780a2021/equipe04/humidity', JSON.stringify(payloadHumid))
	setTimeout(publishData, 3000);

}

publishData();
