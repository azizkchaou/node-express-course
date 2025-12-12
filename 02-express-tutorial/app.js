const http = require('http');
const {readFileSync, read} = require('fs');

// get all files 
const homePage = readFileSync('./index.html');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        console.log(req.method);
        res.writeHead(200 , {'content-type' : 'text/html'});
        res.write(homePage);
        res.end();
    }
    else if (req.url ==='/about') {
        console.log(req.url);
        res.writeHead(200 , {'content-type' : 'text/html'});
        res.end('<h1>here is our short history</h1>');
    }
    else {
        res.writeHead(404 , {'content-type' : 'text/html'});
        res.write(`
        <h1>Ooops!</h1>
        <p>we can't seem to find the page you are looking for</p>   
        <a href="/">back home</a>
        `);
        res.end();
    }
});
server.listen(5000);
