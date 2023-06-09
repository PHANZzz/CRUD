// server.js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.readFile('./conhtmltonodejs.html', (err, data) => {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

server.listen(3000);
