const http = require('http');
const {readFileSync, read} = require('fs');

// get all files 
const homePage = readFileSync('./navbar-app/index.html');
const homeStyles = readFileSync('./navbar-app/styles.css');
const homeImage = readFileSync('./navbar-app/logo.svg');
const homeLogic = readFileSync('./navbar-app/browser-app.js');

const server = http.createServer((req, res) => {
    //home page
    if (req.url === '/') {
        console.log(req.method);
        res.writeHead(200 , {'content-type' : 'text/html'});
        res.write(homePage);
        res.end();
    }
    //styles
    else if (req.url === '/styles.css') {
        res.writeHead(200 , {'content-type' : 'text/css'});
        res.write(homeStyles);
        res.end();
    }
    //image/logo
    else if (req.url === '/logo.svg') {
        res.writeHead(200 , {'content-type' : 'image/svg+xml'});
        res.write(homeImage);
        res.end();
    }
    else if (req.url ==='/about') {
        console.log(req.url);
        res.writeHead(200 , {'content-type' : 'text/html'});
        res.end('<h1>here is our short history</h1>');
    }
    //logic
    else if (req.url === '/browser-app.js') {
        res.writeHead(200 , {'content-type' : 'text/javascript'});
        res.write(homeLogic);
        res.end();
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
