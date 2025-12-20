const express = require('express');
const app = express();

//static assets
app.use(express.static('./methods-public'));
//parse forms 
app.use(express.urlencoded({extended:false}));
//parse json
app.use(express.json());
//routes
app.use('/api/people' , require('./routes/people'));
app.use('/login' , require('./routes/auth'));




app.listen(5000 , () => {
    console.log('Server is listening on port 5000...');
})