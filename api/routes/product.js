const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer"); //parse the incoming form data
const checkAuth = require('../middleware/check-auth');

const Product = require("../models/product");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        // console.log(file);
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    Product.find()
    .select("name price _id productImage") 
    .exec()
    .then(result => {
        if(result.length > 0){
            res.status(200).json({
                count : result.length,
                items: result.map(item => {
                    return { 
                        name: item.name,
                        id: item._id,
                        price: item.price,
                        image: item.productImage,
                        request:{
                            type: 'GET',
                            url: "http://localhost:8000/products/" + item._id
                        }
                    }
                })
            })
        }else {
            res.status(404).json({
                errorMsg : "No products found"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            errorMsg : error
        })
    });
});

router.post('/', upload.single('productImage'),  (req, res, next) => {
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
    .then(function(result){
        res.status(200).json({
            message : "Product created ",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:8000/products/" + result._id
                }
            }
        });
    })
    .catch(function(error){
        res.status(500).json({
             errorMsg : error,
        })
    })
     
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(function(result){
        if(result){
            res.status(200).json({
                message : "Product found ",
                createdProduct: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/products'
                }
            });
        }else{
            res.status(500).json({
                errorMsg : "Product doesnot exists with given id",
            })
        }
        
    })
    .catch(function(error){
        res.status(500).json({
             errorMsg : error,
        })
    })
});


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message : "Updated product "
    }); 
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id : id} )
    .exec()
    .then(result => {
        res.status(200).json({
            message : "product deleted successfully ",
            request : {
                type: 'POST',
                url: 'http://localhost:8000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
    })
    .catch(function(error){
        res.status(500).json({
             errorMsg : error,
        })
    })
     
});


module.exports = router;