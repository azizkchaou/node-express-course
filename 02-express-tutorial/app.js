const express = require('express');
const app = express();
const {products} = require('./data');


app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><a href="/about">About</a>');
});

app.get('/about' , (req , res) => {
    res.send('About Page');
})

app.get('/api/products' , (req , res) => {
    const newProducts = products.map((product) => {
        const {id , name ,image} =  product;
        return {id , name , image};
    }
    );
    res.json(newProducts);
})
app.get('/api/products/:productID' , (req , res) => {
    const {productID} = req.params;
    const singleProduct = products.find((product) => product.id === Number(productID));
    if(!singleProduct){
        return res.status(404).send('Product Does Not Exist');
    }
    return res.json(singleProduct);
});

app.get('/api/v1/query' , (req, res) => {
    //console.log(req.query);
    let sortedProducts = [...products];
    const {search , limit} = req.query;
    
    if (search){
        sortedProducts = sortedProducts.filter((product) => {
            return product.name.startsWith(search);
        });
    }
    if (limit){
        sortedProducts = sortedProducts.slice(0 , Number(limit));
    }
    if (sortedProducts.length < 1){
        // res.status(200).send('No Products Matched Your Search');
        return res.status(200).json({success:true , data: []});
    }
    res.status(200).json(sortedProducts);

})

app.all('*' , (req , res) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});


app.listen(5000 , () => {
    console.log('Server is listening on port 5000...');
})