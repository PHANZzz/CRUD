// server.js
const http = require('http'); // This line imports the built-in 'http' module which provides functionality for creating an HTTP server.
const fs = require('fs'); // This line imports the built-in 'fs' module which provides functionality for working with the file system.

const server = http.createServer((req, res) => { // This line creates a new HTTP server. The callback function passed as an argument is called whenever a request is received by the server.
  fs.readFile('./index.html', (err, data) => { // This line reads the content of the 'index.html' file. The callback function passed as an argument is called when the file has been read.
    if (err) throw err; // This line checks if there was an error reading the file. If there was an error, it is thrown and the program stops executing.
    res.writeHead(200, {'Content-Type': 'text/html'}); // This line sets the status code and headers of the response. In this case, we set the status code to 200 (OK) and the 'Content-Type' header to 'text/html'.
    res.write(data); // This line writes the content of the 'index.html' file to the response body.
    res.end(); // This line ends the response and sends it back to the client.
  });
});

server.listen(3000); // This line starts the server and makes it listen for incoming requests on port 3000.
