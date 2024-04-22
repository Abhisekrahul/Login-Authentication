const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId:{
        required:true,
        type:Number
    },
    name:{
        required:true,
        type:String
    },
    productId:{
        require:true,
        type:Number
    },
    email:{
        required:true,
        type:String
    }

})

const Product = mongoose.model()