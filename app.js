const express = require('express');
const app = express();
const port = 8080;


const { spawn } = require('node:child_process');
const ls = spawn('python', ['-u','./temperature.py']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});



//var spawn = require('child_process').spawn
/*    temp    = spawn('python', ['temperature.py']);

temp.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

temp.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

temp.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});



app.get('/', callName);

function callName(req, res) {
    console.log("yoyoyo")
      
    // Use child_process.spawn method from 
    // child_process module and assign it
    // to variable spawn
    const spawn = require("child_process").spawn;
      
    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script 
      
    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python',["./temperature.py"] );
  
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        console.log("Yo")
        res.send(data.toString());
    } )
}

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

*/
