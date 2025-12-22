const express = require('express');
const app = express();
//const {tasks} = require('./data/tasks');
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
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

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI); 
        const PORT = process.env.PORT ;
        app.listen(PORT , () => { console.log(`*****************server is listening on port ${PORT}...***************************`);})
    } catch (error) {
        console.log(error);
    }
}

//api.get('/api/v1/tasks')               - get all the tasks 
//api.post('api/v1/tasks')               - create new task 
//api.get('/api/v1/tasks/:id')           - get single task
//api.patch('/api/v1/tasks/:id')         - update task 
//api.delete('/api/v1/tasks/:id')        - delete task 

start();

