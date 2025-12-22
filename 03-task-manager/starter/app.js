const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

//middlewares : 
// static assets
app.use(express.static('./public'));
//parse forms 
app.use(express.urlencoded({extended:false}));
//parse json
app.use(express.json());
//routes
app.use('/api/v1/tasks', require('./routes/tasks'));
//not found middleware
app.use(notFound);
//error handler middleware
app.use(errorHandlerMiddleware);



app.get('/' , (req , res) => {
    res.sendFile('./public/index.html' , {root: __dirname});
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


start();

