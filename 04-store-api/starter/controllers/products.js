const Product = require('../models/product');

const getAllProducts = async (req , res) => {
    const products = await Product.find({});
    res.status(200).json({msg:'products route' , data : products});
}

const getProduct =async (req , res) => {
    const {id} = req.params;
    try {
            const product = await Product.findById(id);
            return res.status(200).json({msg:'single product route' , data : product});
    } catch(error) {
        return res.status(500).json({msg : `no product with that id ${id}`});
    }
}

const createProduct = async  (req , res) => {
    const product = req.body;
    try {
        const newProduct = await Product.create(product);
        return res.status(201).json({msg:'create product route' , data : newProduct});
    }catch(error) {
        return res.status(500).json({msg : error});
    }
}


const updateProduct = async  (req , res) => {
    const {id} = req.params;
    const product = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id , product , { new : true , runValidators : true});
        return res.status(200).json({msg:'update product route' , data : updatedProduct});
    }catch(error) {
        return res.status(500).json({msg : `no product with that id ${id}`});
    }
}

const deleteProduct = async (req , res) => {
    const {id} = req.params;
    try {
        await Product.findByIdAndDelete(id);
        return res.status(200).json({msg:`delete product ${id}`});
    } catch(error) {
        return res.status(500).json({msg : `no product with that id ${id}`});
    }
}
const getCompanyProducts = async (req , res) => {
    const {company} = req.params;
    try {
        const products = await Product.find({company : company});
        return res.status(200).json({msg:`all products of company :  ${company}` , data : products});
    }
    catch(error) {
        return res.status(500).json({msg : `no products found for company ${company}`});
    }
}

const deleteCompanyProducts = async (req , res) => {
    const {company} = req.params;
    try {
        const result = await Product.deleteMany({company : company});
        return res.status(200).json({msg:`delete all products of company :  ${company}` , result : result});
    }
    catch(error) {
        return res.status(500).json({msg : `no products found for company ${company}`});
    }
}

const updateCompanyProducts = async (req , res) => {
    const {company} = req.params;
    const update = req.body;
    try {
        const result = await Product.updateMany({company : company} , update , {runValidators : true});
        return res.status(200).json({msg:`update all products of company :  ${company}` , result : result});
    }   
    catch(error) {
        return res.status(500).json({msg : `no products found for company ${company}`});
    }
}

const getProductsByPrice = async (req , res) => {
    const {price} = req.params;
    try {
        const products = await Product.find({price : {$lte : price}});
        return res.status(200).json({msg:`all products below price :  ${price}` , data : products});
    } catch(error) {
        return res.status(500).json({msg : `no products found below price ${price}`});  
    }
}

const getProductByName = async (req , res) => {
    const {name} = req.params;  
    try {
        const products = await Product.find({name : name});
        return res.status(200).json({msg:`all products with name :  ${name}` , data : products});
    }
    catch(error) {  
        return res.status(500).json({msg : `no products found with name ${name}`});
    }
}

const findProducts = async (req , res) => {
    const {name , company , price} = req.query;
    const queryObject = {};
    if(name) {
        queryObject.name = {$regex : name , $options : 'i'};
    }
    if(company) {
        queryObject.company = company;
    }
    if(price) {
        queryObject.price = {$lte : Number(price)};
    }
    const products = await Product.find(queryObject);
    res.status(200).json({msg:'filtered products' , data : products});
}

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCompanyProducts,
    deleteCompanyProducts,
    updateCompanyProducts,
    getProductsByPrice,
    getProductByName,
    findProducts
}
