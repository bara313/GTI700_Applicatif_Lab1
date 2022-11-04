const express = require('express');
const app = express();
const port = 8080;
var temp

const { spawn } = require('node:child_process');
const ls = spawn('python', ['-u','./temperature.py']);

ls.stdout.on('data', (data) => {
  temp=data
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});





app.get('/', (req, res) => res.send('Hello World!: ' + temp))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


