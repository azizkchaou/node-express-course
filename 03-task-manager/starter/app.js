const express = require('express');
const app = express();
const {tasks} = require('./data/tasks');

//middlewares : 


// static assets
app.use(express.static('./public'));
//parse forms 
app.use(express.urlencoded({extended:false}));
//parse json
app.use(express.json());
//routes
app.use('/api/v1/tasks', require('./routes/tasks'));

app.get('/' , (req , res) => {
    res.sendFile('./public/index.html' , {root: __dirname});
})



app.all('*' , (req , res) => {
    res.status(404).send('<h1>resource not found</h1>');
})

app.listen(5000 , () => 
{
    console.log('server is listening on port 5000...')
})

//api.get('/api/v1/tasks')               - get all the tasks 
//api.post('api/v1/tasks')               - create new task 
//api.get('/api/v1/tasks/:id')           - get single task
//api.patch('/api/v1/tasks/:id')         - update task 
//api.delete('/api/v1/tasks/:id')        - delete task 




app.post('/api/v1/tasks' , (req ,res) => {
    
})