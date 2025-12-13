const express = require('express')
const app = express();
const {products} = require('./data');

app.get('/' , (req , res) => {
    res.send('<h1>Home Page</h1><a href="/api/products">Products</a>');
})

app.get('/api/products' , (req , res) => {
    const newProducts = products.map((product) => {
        const {id , name ,image} =  product;
        return {id , name , image};
    }
    );
    res.json(newProducts);
})

app.get('/api/products/1' , (req , res) => {
    const singleProduct = products.find((product) => product.id === 1);
    res.json(singleProduct);
});

app.get('/api/products/:productID' , (req , res) => {
    const {productID} = req.params;
    const singleProduct = products.find((product) => product.id === Number(productID));
    if(!singleProduct){
        return res.status(404).send('Product Does Not Exist');
    }
    return res.json(singleProduct);
});

app.get('/api/products/:productID/reviews/:reviewID' , (req , res) => {
    console.log(req.params);
    res.send('Hello World');
});
app.get('/api/products/:productID/users/:userID' , (req , res) => {
    console.log(req.params);
    res.send('Hello World');
});

app.get('/api/users' , (req , res) => {
    console.log('aziz');
    res.send('Hello Users');
});
app.all('*' , (req , res) => {  
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

app.listen(5000 , () => {
    console.log('Server is listening on port 5000...');
});
