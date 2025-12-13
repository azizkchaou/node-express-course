const express = require('express');
const app = express()

app.listen(5000 , () => {
    console.log('server is listening on port 5000....');
})

app.get('/' , (req  ,res) => {
    console.log('user hit the home page(ressource)');
    res.send('<h1> Home Page </h1>')
}) 
//the callback function will be invoked eahc time someone visits the route of home page

app.get('/about' , (req  ,res) => {
    console.log('user hit the about page');
    res.send('<h1> About Page </h1>')
})

app.all('*' , (req  ,res) => {
    res.status(404).send('<h1> Resource not found </h1>')
})
//the '*' means all routes that are not defined above it


//app.get
//app.post
//app.put
//app.delete
//app.all
//app.use
//app.listen