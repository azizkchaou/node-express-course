const moongoose = require('mongoose');

const ProductSchema = new moongoose.Schema({
    name : {
        type : String ,
        required : [true , 'product name must be provided'],
        trim : true ,
        maxlength : [100 , 'product name can not be more than 100 characters']  }
    ,
    price : {
        type : Number , 
        required : [true , 'product price must be provided']
    } ,
    featured : {
        type : Boolean ,
        default : false
    } ,
    rating : {
        type : Number , 
        default : 4.5
    } ,
    createdAt : {
        type : Date ,
        default : Date.now()
    } ,
    company : {
        type : String , 
        enum : {
            values : ['ikea' , 'liddy' , 'caressa' , 'marcos'] ,
            message : '{VALUE} is not supported'
        }
    } 
    
})
module.exports = moongoose.model('Product' , ProductSchema);