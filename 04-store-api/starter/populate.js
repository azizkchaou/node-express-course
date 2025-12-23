require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany(); //all the products that already there
        await Product.create(jsonProducts);
        console.log('products added successfully');
        process.exit(0);
    } catch (error) {
        console.log(error);
    }
}
start();